"use client";
import { useEffect, useState } from "react";
import { apiGetMessages } from "@/lib/api";

export default function AdminBanner() {
  const [msgs, setMsgs]         = useState<any[]>([]);
  const [idx, setIdx]           = useState(0);
  const [dismissed, setDismiss] = useState<string[]>([]);

  useEffect(() => { apiGetMessages().then(d => setMsgs(d.messages || [])).catch(() => {}); }, []);
  useEffect(() => {
    if (msgs.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % msgs.length), 5000);
    return () => clearInterval(t);
  }, [msgs]);

  const active = msgs.filter(m => !dismissed.includes(m.id));
  if (!active.length) return null;
  const cur = active[idx % active.length];
  if (!cur) return null;

  const s: Record<string, string> = {
    info:    "border-blue-500/30 bg-blue-500/10 text-blue-300",
    warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    success: "border-[#00FF85]/30 bg-[#00FF85]/10 text-[#00FF85]",
    error:   "border-red-500/30 bg-red-500/10 text-red-300",
  };
  const icons: Record<string, string> = { info: "ℹ️", warning: "⚠️", success: "✅", error: "🚨" };

  return (
    <div className={`w-full border-b px-4 py-2.5 ${s[cur.type] || s.info}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm shrink-0">{icons[cur.type]}</span>
          <p className="text-xs font-semibold">{cur.message}</p>
        </div>
        <button onClick={() => setDismiss(p => [...p, cur.id])} className="text-xs opacity-50 hover:opacity-100 font-bold shrink-0">✕</button>
      </div>
    </div>
  );
}
