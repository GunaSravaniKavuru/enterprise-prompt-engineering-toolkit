import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const tooltipStyle = {
  background: "#171a29",
  border: "1px solid rgba(148,156,199,0.22)",
  borderRadius: 12,
  fontSize: 12,
  color: "#e9eaf2",
};

const colors = ["#8b5cf6", "#22d3ee", "#f5a623", "#34d399", "#fb7185"];

export default function CategoryChart({ data }) {
  return (
    <div className="mt-6 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3} stroke="none">
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
