import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../common/Icon";
import { currentUser, notifications } from "../../data/dummyData";

export default function Navbar({ onMenuClick, theme, onToggleTheme }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--color-border-soft)] bg-[#0a0c14]/70 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-ink-dim hover:text-ink hover:bg-white/5 focus-ring lg:hidden"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="hidden items-center gap-2 rounded-xl border border-[var(--color-border-soft)] bg-white/[0.03] px-3 py-2 text-sm text-ink-faint lg:flex lg:w-80">
        <Icon name="search" size={16} />
        <input
          placeholder="Search prompts, projects, models…"
          className="w-full bg-transparent outline-none placeholder:text-ink-faint text-ink"
        />
        <kbd className="rounded border border-[var(--color-border-soft)] px-1.5 py-0.5 text-[10px] text-ink-faint">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="rounded-lg p-2.5 text-ink-dim hover:text-ink hover:bg-white/5 focus-ring"
          aria-label="Toggle theme"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-lg p-2.5 text-ink-dim hover:text-ink hover:bg-white/5 focus-ring"
          >
            <Icon name="bell" size={17} />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-rose-400 to-amber-400" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                className="glass-hi absolute right-0 mt-2 w-80 rounded-2xl p-2"
              >
                <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  Notifications
                </p>
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-xl px-3 py-2.5 hover:bg-white/5">
                    <div className="flex items-center gap-2">
                      {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                      <p className="text-sm text-ink">{n.title}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-faint">{n.detail}</p>
                    <p className="mt-1 text-[10px] text-ink-faint">{n.time}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 focus-ring"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-semibold text-black">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden text-left leading-tight md:block">
              <p className="text-xs font-medium text-ink">{currentUser.name}</p>
              <p className="text-[10px] text-ink-faint">{currentUser.role}</p>
            </div>
            <Icon name="chevronDown" size={14} className="hidden text-ink-faint md:block" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                className="glass-hi absolute right-0 mt-2 w-52 rounded-2xl p-2 text-sm"
              >
                <p className="px-3 py-2 text-xs text-ink-faint">{currentUser.org}</p>
                <button className="w-full rounded-xl px-3 py-2 text-left text-ink-dim hover:bg-white/5 hover:text-ink">
                  Profile
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-ink-dim hover:bg-white/5 hover:text-ink">
                  Billing
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-rose-300 hover:bg-rose-500/10">
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
