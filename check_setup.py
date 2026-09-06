#!/usr/bin/env python3
"""Is the C&C portal actually set up? Run this after every setup step.

    python3 check_setup.py

Manual setup across a dashboard, a SQL editor and Vercel has no build to fail,
so this is the build. It reads .env.local, talks to Supabase, and tells you the
next thing that is wrong. Prints no secrets.
"""

import json
import pathlib
import sys
import urllib.error
import urllib.request

HERE = pathlib.Path(__file__).parent
TABLES = ("cc_members", "cc_leads", "cc_events", "cc_documents",
          "cc_notes", "cc_invoices", "cc_capabilities")

OK, BAD, WARN = "  ok  ", " FAIL ", " todo "


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
