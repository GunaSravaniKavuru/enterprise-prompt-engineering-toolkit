import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const tooltipStyle = {
  background: "#171a29",
  border: "1px solid rgba(148,156,199,0.22)",
  borderRadius: 12,
  fontSize: 12,
  color: "#e9eaf2",
};

const axisStyle = { fontSize: 11, fill: "#6a6f85" };

export default function ActivityChart({ data }) {
  return (
    <div className="mt-6 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,156,199,0.08)" vertical={false} />
          <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="prompts" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3, fill: "#8b5cf6" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
