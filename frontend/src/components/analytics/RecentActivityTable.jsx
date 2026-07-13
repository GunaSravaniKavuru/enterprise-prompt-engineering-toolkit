import { motion } from "framer-motion";
import Card from "../common/Card";
import Icon from "../common/Icon";

const statusStyles = {
  Success: "bg-emerald-500/12 text-emerald-300",
  Warning: "bg-amber-500/12 text-amber-300",
  Active: "bg-cyan-500/12 text-cyan-300",
};

export default function RecentActivityTable({ rows, searchQuery, onSearchChange }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border border-white/10">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Recent activity</h3>
            <p className="mt-1 text-sm text-ink-dim">Latest prompt actions across your workspace.</p>
          </div>
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-ink-dim">
            <Icon name="search" size={14} />
            <input value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search" className="w-32 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint" />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.22em] text-ink-faint">
              <tr>
                <th className="px-5 py-3">Prompt</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Model</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-white/10 bg-transparent text-ink transition-colors hover:bg-white/5">
                  <td className="px-5 py-4 font-medium">{row.prompt}</td>
                  <td className="px-5 py-4 text-ink-dim">{row.action}</td>
                  <td className="px-5 py-4 text-ink-dim">{row.model}</td>
                  <td className="px-5 py-4 text-ink-dim">{row.date}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status] || "bg-white/10 text-ink-dim"}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
