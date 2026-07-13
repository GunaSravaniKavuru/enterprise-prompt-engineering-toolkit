import { NavLink } from "react-router-dom";
import { navItems } from "../../data/dummyData";
import Icon from "../common/Icon";

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 shrink-0 border-r border-[var(--color-border-soft)] bg-[#0d0f19]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:bg-[#0d0f19]/60 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-[var(--color-border-soft)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-sm font-bold text-black">
            P
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-ink">Prompt Toolkit</p>
            <p className="text-[10px] text-ink-faint">Enterprise Edition</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors focus-ring ${
                  isActive
                    ? "text-ink bg-white/[0.06]"
                    : "text-ink-dim hover:text-ink hover:bg-white/[0.04]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 to-cyan-400" />
                  )}
                  <Icon
                    name={item.icon}
                    size={17}
                    className={isActive ? "text-violet-300" : "text-ink-faint group-hover:text-ink-dim"}
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
