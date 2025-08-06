import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ArtistChartProps {
  data: { name: string; value: number; fill?: string }[];
  height?: number;
  showLegend?: boolean;
}

const ArtistChart: React.FC<ArtistChartProps> = ({
  data,
  height = 320,
  showLegend = true,
}) => {
  const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

  const dataWithColors = data.map((entry, index) => ({
    ...entry,
    fill: entry.fill || COLORS[index % COLORS.length],
  }));

  const renderCustomizedLabel = ({ name, value }: any) => {
    return `${name}: ${value}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={dataWithColors}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1000}
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#F9FAFB",
          }}
          itemStyle={{ color: "#cececeff" }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "20px", color: "#F9FAFB" }}
            iconType="circle"
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ArtistChart;
