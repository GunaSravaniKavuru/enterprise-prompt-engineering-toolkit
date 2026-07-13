import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const tooltipStyle = {
  background: "#171a29",
  border: "1px solid rgba(148,156,199,0.22)",
  borderRadius: 12,
  fontSize: 12,
  color: "#e9eaf2",
};

const axisStyle = { fontSize: 11, fill: "#6a6f85" };

export function UsageAreaChart({ data, dataKey = "prompts" }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,156,199,0.08)" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey={dataKey} stroke="#a78bfa" strokeWidth={2} fill="url(#usageGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ScorePieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CategoryBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,156,199,0.08)" vertical={false} />
        <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,156,199,0.06)" }} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#22d3ee" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ data, dataKey, xKey }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,156,199,0.08)" vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey={dataKey} stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, fill: "#34d399" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ResponseTimeBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,156,199,0.08)" horizontal={false} />
        <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis dataKey="model" type="category" tick={axisStyle} axisLine={false} tickLine={false} width={100} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(148,156,199,0.06)" }} />
        <Bar dataKey="ms" radius={[0, 8, 8, 0]} fill="#f5a623" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function QualityRadarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(148,156,199,0.16)" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: "#9297ad", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Radar name="Claude" dataKey="Claude" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.28} />
        <Radar name="GPT" dataKey="GPT" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.18} />
        <Radar name="Gemini" dataKey="Gemini" stroke="#f5a623" fill="#f5a623" fillOpacity={0.16} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
