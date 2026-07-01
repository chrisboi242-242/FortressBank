"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { apiGetMe, apiGetMyTransactions } from "@/lib/api";
import AdminBanner from "@/components/shared/AdminBanner";

type Ctx = { user: any; refreshUser: () => Promise<void> };
const DashCtx = createContext<Ctx | null>(null);
export const useDashboard = () => {
  const ctx = useContext(DashCtx);
  if (!ctx) throw new Error("useDashboard must be inside DashboardShell");
  return ctx;
};

function SvgIcon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const I = {
  home:    "M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9",
  send:    "M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z",
  receive: "M22 12H2M12 2v10m0 0-4-4m4 4 4-4",
  history: "M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8M12 7v5l4 2",
  card:    "M2 7h20M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM6 15h4",
  bell:    "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM10.3 21a1.94 1.94 0 0 0 3.4 0",
  menu:    "M3 6h18M3 12h18M3 18h18",
  close:   "M18 6 6 18M6 6l12 12",
  logout:  "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  chevron: "m9 18 6-6-6-6",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
};

const NAV = [
  { label: "Overview",     href: "/dashboard",              icon: "home"    },
  { label: "Send Money",   href: "/dashboard/transfers",    icon: "send"    },
  { label: "Receive",      href: "/dashboard/receive",      icon: "receive" },
  { label: "Transactions", href: "/dashboard/transactions", icon: "history" },
  { label: "Cards",        href: "/dashboard/cards",        icon: "card"    },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser]       = useState<any>(null);
  const [notifs, setNotifs]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [side, setSide]       = useState(false);
  const [notifOpen, setNO]    = useState(false);
  const [profOpen, setPO]     = useState(false);
  const nRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    const { user: u } = await apiGetMe();
    setUser(u);
    try {
      const { transactions } = await apiGetMyTransactions();
      setNotifs((transactions || []).slice(0, 8).map((tx: any) => ({
        id: tx.id,
        title: tx.direction === "RECEIVED"
          ? `Received ${tx.currency} ${Number(tx.amount).toLocaleString()}`
          : `Sent ${tx.currency} ${Number(tx.amount).toLocaleString()}`,
        sub:    tx.status === "PENDING" ? "Pending" : tx.status,
        time:   tx.createdAt,
        unread: tx.status === "PENDING",
      })));
    } catch {}
  };

  const refreshUser = async () => { try { await loadData(); } catch {} };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u || !u.emailVerified) { router.push("/login"); return; }
      try { await loadData(); } catch { router.push("/login"); }
      finally { setLoading(false); }
    });
    return unsub;
  }, [router]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (nRef.current && !nRef.current.contains(e.target as Node)) setNO(false);
      if (pRef.current && !pRef.current.contains(e.target as Node)) setPO(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => setSide(false), [pathname]);

  const ago = (s: string) => {
    const m = Math.floor((Date.now() - new Date(s).getTime()) / 60000);
    if (m < 1)    return "Just now";
    if (m < 60)   return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m/60)}h ago`;
    return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-10 w-10 border-2 border-white/10 border-t-[#00FF85] rounded-full animate-spin mx-auto" />
        <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest">Unlocking vault</p>
      </div>
    </div>
  );

  const unread = notifs.filter(n => n.unread).length;

  return (
    <DashCtx.Provider value={{ user, refreshUser }}>
      <div className="min-h-screen bg-[#0A0B0D] text-white">

        {/* SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 w-[256px] bg-[#0D0E11] border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-300 ease-out ${side ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="h-[68px] px-5 flex items-center justify-between border-b border-white/[0.06]">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="h-7 w-7 bg-[#00FF85] rounded-[6px] rotate-45 group-hover:rotate-0 transition-all duration-500 flex items-center justify-center">
                <div className="h-2.5 w-2.5 border-[1.5px] border-black rounded-[2px]" />
              </div>
              <span className="text-[14px] font-black tracking-tight uppercase">Fortress</span>
            </Link>
            <button onClick={() => setSide(false)} className="lg:hidden text-white/40 hover:text-white">
              <SvgIcon d={I.close} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
            {[...NAV, ...(user?.role === "admin" ? [{ label: "Admin Panel", href: "/dashboard/admin", icon: "shield" }] : [])].map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 h-[42px] px-3.5 rounded-[10px] text-[13px] font-semibold transition-all ${active ? "bg-[#00FF85]/10 text-[#00FF85]" : "text-white/40 hover:text-white hover:bg-white/[0.04]"}`}>
                  <SvgIcon d={I[item.icon as keyof typeof I]} size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/[0.06] space-y-2">
            <div className="px-3.5 py-2.5 rounded-[10px] bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${user?.status === "ACTIVE" ? "bg-[#00FF85]" : "bg-yellow-400"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                  {user?.status === "ACTIVE" ? "Vault Active" : "Pending Review"}
                </span>
              </div>
            </div>
            <button onClick={async () => { await signOut(auth); router.push("/login"); }}
              className="flex items-center gap-3 h-[42px] px-3.5 rounded-[10px] text-[13px] font-semibold text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all w-full">
              <SvgIcon d={I.logout} size={16} />Sign out
            </button>
          </div>
        </aside>

        {side && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSide(false)} />}

        {/* MAIN */}
        <div className="lg:pl-[256px]">
          <header className="sticky top-0 z-30 h-[68px] bg-[#0A0B0D]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSide(v => !v)} className="h-9 w-9 rounded-[8px] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.04] transition-all">
                <SvgIcon d={I.menu} />
              </button>
              <div>
                <p className="text-[11px] text-white/25 leading-none">Welcome back</p>
                <p className="text-[14px] font-black leading-none mt-0.5">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Bell */}
              <div className="relative" ref={nRef}>
                <button onClick={() => setNO(v => !v)} className="relative h-9 w-9 rounded-[8px] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.04] transition-all">
                  <SvgIcon d={I.bell} />
                  {unread > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#00FF85] ring-2 ring-[#0A0B0D]" />}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[310px] max-w-[92vw] bg-[#0D0E11] border border-white/10 rounded-[14px] shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[13px] font-black">Notifications</p>
                      {unread > 0 && <span className="text-[10px] font-bold text-[#00FF85] uppercase">{unread} new</span>}
                    </div>
                    <div className="max-h-[280px] overflow-y-auto">
                      {notifs.length === 0
                        ? <p className="py-10 text-center text-white/25 text-xs">No notifications yet.</p>
                        : notifs.map(n => (
                          <div key={n.id} className="flex gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                            <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-[#00FF85]" : "bg-white/15"}`} />
                            <div>
                              <p className="text-[12px] font-semibold leading-snug">{n.title}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] text-white/25">{n.sub}</span>
                                <span className="text-white/15">·</span>
                                <span className="text-[11px] text-white/25">{ago(n.time)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <Link href="/dashboard/transactions" onClick={() => setNO(false)}
                      className="block text-center py-3 text-[12px] font-bold text-[#00FF85] hover:bg-white/[0.02] border-t border-white/[0.06]">
                      View all activity
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative" ref={pRef}>
                <button onClick={() => setPO(v => !v)} className="flex items-center gap-2 h-9 pl-1.5 pr-2 rounded-[8px] hover:bg-white/[0.04] transition-all">
                  <div className="h-7 w-7 rounded-full bg-[#00FF85]/10 border border-[#00FF85]/20 flex items-center justify-center">
                    <span className="text-[#00FF85] text-[11px] font-black">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                  </div>
                  <SvgIcon d={I.chevron} size={13} />
                </button>
                {profOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[200px] bg-[#0D0E11] border border-white/10 rounded-[14px] shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[13px] font-black truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[11px] text-white/25 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link href="/dashboard/cards" onClick={() => setPO(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[12px] font-semibold text-white/45 hover:text-white hover:bg-white/[0.04] transition-all">
                        <SvgIcon d={I.card} size={14} />My Card
                      </Link>
                      <button onClick={async () => { await signOut(auth); router.push("/login"); }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-[12px] font-semibold text-white/45 hover:text-red-400 hover:bg-red-500/[0.06] transition-all w-full">
                        <SvgIcon d={I.logout} size={14} />Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <AdminBanner />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </DashCtx.Provider>
  );
}
