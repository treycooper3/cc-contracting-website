"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../../../lib/supabase";

/**
 * Uploads straight from the browser to the private cc-documents bucket. The
 * storage policy requires a cc_members row, so the anon key alone gets nowhere.
 */
export default function DocumentUpload({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError("");
    const supabase = createClient();
    const path = `${leadId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;

    const upload = await supabase.storage.from("cc-documents").upload(path, file);
    if (upload.error) {
      setError(upload.error.message);
      setBusy(false);
      return;
    }

    const insert = await supabase
      .from("cc_documents")
      .insert({ lead_id: leadId, label: file.name, storage_path: path });
    if (insert.error) setError(insert.error.message);

    setBusy(false);
    event.target.value = "";
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="file" onChange={upload} disabled={busy} className="text-sm text-muted" />
      {busy && <p className="text-sm text-muted">Uploading</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
