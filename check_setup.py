#!/usr/bin/env python3
"""Is the C&C portal actually set up? Run this after every setup step.

    python3 check_setup.py

Manual setup across a dashboard, a SQL editor and Vercel has no build to fail,
so this is the build. It reads .env.local, talks to Supabase, and tells you the
next thing that is wrong. Prints no secrets.
"""

import base64
import json
import pathlib
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

HERE = pathlib.Path(__file__).parent
TABLES = ("cc_members", "cc_leads", "cc_events", "cc_documents",
          "cc_notes", "cc_invoices", "cc_capabilities")
PROJECT_REF = "rrhpsjxbpsvmritkjgdj"
SITE_URL = "https://www.candcontracting.com"   # keep equal to app/lib/site.ts

OK, BAD, WARN = "  ok  ", " FAIL ", " todo "


def management_token():
    """The Supabase CLI login token, from the macOS keychain. None if absent."""
    try:
        raw = subprocess.run(
            ["security", "find-generic-password", "-s", "Supabase CLI", "-w"],
            capture_output=True, text=True, check=True).stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    prefix = "go-keyring-base64:"
    return base64.b64decode(raw[len(prefix):]).decode() if raw.startswith(prefix) else raw


def redirect_allowed(redirect, site_url, allow_list):
    """Mirror GoTrue's IsRedirectURLValid: same hostname as site_url passes
    outright, otherwise the URL must glob-match an allowlist entry. gobwas/glob
    treats '.' and '/' as separators, so '*' stops at them and only '**' crosses.
    A bare path entry therefore does NOT match '...callback?next=/portal', which
    is exactly how the C&C login ended up on the TnD site for weeks."""
    if urllib.parse.urlparse(redirect).hostname == urllib.parse.urlparse(site_url).hostname:
        return True
    for pattern in allow_list:
        regex = "".join(
            ".*" if tok == "**" else "[^./]*" if tok == "*" else re.escape(tok)
            for tok in re.split(r"(\*\*|\*)", pattern) if tok)
        if re.fullmatch(regex, redirect):
            return True
    return False


def check_auth_redirect(problems):
    print("\nAUTH  (shared project — one site_url, so the allowlist is what routes us)")
    token = management_token()
    if not token:
        print(f"[{WARN}] no Supabase CLI token in keychain; run `supabase login` to check")
        return
    # curl, not urllib: the Management API's Cloudflare front answers urllib with a 1010.
    out = subprocess.run(
        ["curl", "-s", "--max-time", "20", "-H", f"Authorization: Bearer {token}",
         f"https://api.supabase.com/v1/projects/{PROJECT_REF}/config/auth"],
        capture_output=True, text=True).stdout
    try:
        config = json.loads(out)
        site_url, allow = config["site_url"], config["uri_allow_list"].split(",")
    except (ValueError, KeyError):
        print(f"[{BAD}] could not read auth config: {out[:80]}")
        problems.append("auth config unreadable — token expired? `supabase login`")
        return
    # The URL the login page really sends, query string included.
    redirect = f"{SITE_URL}/auth/callback?next={urllib.parse.quote('/portal', safe='')}"
    ok = redirect_allowed(redirect, site_url, allow)
    print(f"[{OK if ok else BAD}] {redirect}")
    print(f"        site_url={site_url}")
    if not ok:
        problems.append(f"magic links will land on {site_url}: add {SITE_URL}/auth/** "
                        "to the auth redirect allowlist")


def load_env():
    path = HERE / ".env.local"
    if not path.exists():
        sys.exit("No .env.local. Copy .env.local.example to .env.local first.")
    env = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            env[key.strip()] = value.strip().strip('"').strip("'")
    return env


def get(url, key, path, extra=None):
    req = urllib.request.Request(
        f"{url}/{path}",
        headers={"apikey": key, "Authorization": f"Bearer {key}", **(extra or {})})
    with urllib.request.urlopen(req, timeout=20) as response:
        return response.read().decode(), dict(response.headers)


def main():
    env = load_env()
    url = env.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
    anon = env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    service = env.get("SUPABASE_SERVICE_ROLE_KEY", "")
    problems = []

    print("\nENVIRONMENT")
    for key in ("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY",
                "SUPABASE_SERVICE_ROLE_KEY", "CC_LEADS_WEBHOOK_SECRET",
                "CC_CALENDAR_TOKEN"):
        value = env.get(key, "")
        print(f"[{OK if value else WARN}] {key:<32} {len(value)} chars")
        if not value:
            problems.append(f"{key} is empty in .env.local")

    if not url or not anon:
        print("\nCannot reach Supabase without a URL and anon key.\n")
        return 1

    check_auth_redirect(problems)

    print("\nSCHEMA  (migration 001)")
    for table in TABLES:
        column = "user_id" if table == "cc_members" else "id"
        try:
            get(url, anon, f"rest/v1/{table}?select={column}&limit=1")
            print(f"[{OK}] {table}")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode()[:70]
            print(f"[{BAD}] {table}: {detail}")
            problems.append(f"{table} missing — run 001_cc_crm.sql")

    if not service:
        print(f"\n[{WARN}] Skipping data checks. They need the service role key,\n"
              "        because RLS correctly hides every row from an anonymous reader.")
        return report(problems)

    print("\nDATA  (migrations 002-003)")
    for table in TABLES:
        try:
            _, headers = get(url, service, f"rest/v1/{table}?select=*",
                             {"Prefer": "count=exact", "Range": "0-0"})
            count = int(headers.get("Content-Range", "0/0").split("/")[-1])
        except Exception as exc:                       # noqa: BLE001
            print(f"[{BAD}] {table}: {exc}")
            problems.append(f"could not count {table}")
            continue
        # Members gates everything: with zero rows nobody can even sign in.
        blocking = table == "cc_members" and count == 0
        print(f"[{BAD if blocking else OK if count else WARN}] {table:<18} {count} rows")
        if blocking:
            problems.append("cc_members is empty — nobody can use the portal yet")
        elif table == "cc_leads" and count == 0:
            problems.append("no leads — run 002_seed_history.sql, then 003_members.sql")

    print("\nSTORAGE")
    try:
        body, _ = get(url, service, "storage/v1/bucket")
        names = [b["name"] for b in json.loads(body)]
        found = "cc-documents" in names
        print(f"[{OK if found else BAD}] cc-documents bucket "
              f"{'present' if found else 'MISSING'}   (all buckets: {names})")
        if not found:
            problems.append("cc-documents bucket missing — re-run the tail of 001")
    except Exception as exc:                           # noqa: BLE001
        print(f"[{BAD}] storage check failed: {exc}")

    return report(problems)


def report(problems):
    print()
    if not problems:
        print("Everything checks out. Portal is ready to use.\n")
        return 0
    print(f"{len(problems)} thing(s) left:")
    for i, problem in enumerate(problems, 1):
        print(f"  {i}. {problem}")
    print()
    return 1


if __name__ == "__main__":
    sys.exit(main())
