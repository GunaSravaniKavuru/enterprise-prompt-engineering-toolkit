import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const tooltipStyle = {
  background: "#171a29",
  border: "1px solid rgba(148,156,199,0.22)",
  borderRadius: 12,
  fontSize: 12,
  color: "#e9eaf2",
};

const axisStyle = { fontSize: 11, fill: "#6a6f85" };

export default function EvaluationScoreChart({ data }) {
  return (
    <div className="mt-6 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,156,199,0.08)" horizontal={false} />
          <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis dataKey="category" type="category" tick={axisStyle} axisLine={false} tickLine={false} width={120} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,156,199,0.06)" }} />
          <Bar dataKey="score" radius={[0, 8, 8, 0]} fill="#f5a623" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
