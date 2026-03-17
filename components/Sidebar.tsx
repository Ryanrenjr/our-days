"use client";

import { LayoutGrid, User, Sparkles, Heart, MapPinned, LogOut } from "lucide-react";
import type { Tab } from "../types";
import { createClient } from "../lib/supabase/client";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const navItems: {
  key: Tab;
  label: string;
  sublabel: string;
  icon: any;
}[] = [
  { key: "overview", label: "总览", sublabel: "Overview", icon: LayoutGrid },
  { key: "boy", label: "Ryan的空间", sublabel: "Ryan", icon: User },
  { key: "girl", label: "Suki的空间", sublabel: "Suki", icon: Sparkles },
  { key: "both", label: "共同计划", sublabel: "Together", icon: Heart },
  { key: "travel", label: "旅行记录", sublabel: "Travel", icon: MapPinned },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="hidden w-[290px] shrink-0 px-5 py-5 lg:block">
      <div className="glass-panel flex h-full flex-col rounded-[34px] px-6 py-7">
        <div className="pb-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-soft)]">
            lifestyle planner
          </p>
          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.05em] text-[var(--text-main)]">
            Our Days
          </h1>
        </div>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex w-full items-center gap-4 rounded-[22px] px-4 py-4 text-left transition duration-300 ${
                  isActive
                    ? "bg-white/88 shadow-[0_10px_28px_rgba(20,20,20,0.05)]"
                    : "hover:bg-white/55"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                    isActive
                      ? "bg-[var(--text-main)] text-white"
                      : "bg-[var(--bg-soft)] text-[var(--text-main)]"
                  }`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-[15px] font-medium tracking-[-0.02em] text-[var(--text-main)]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
                    {item.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-[22px] border border-[var(--line-soft)] bg-white px-4 py-4 text-left transition hover:bg-[var(--bg-soft)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bg-soft)] text-[var(--text-main)]">
              <LogOut size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-medium tracking-[-0.02em] text-[var(--text-main)]">
                退出登录
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
                Sign Out
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}