import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  percentage: number;
  label: string;
  description: string;
  color: string;
  trend?: "higher" | "lower" | "typical";
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  percentage,
  label,
  description,
  color,
  trend = "typical",
  onClick,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case "higher":
        return "text-red-400";
      case "lower":
        return "text-green-400";
      default:
        return "text-yellow-400";
    }
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  return (
    <Card
      className={cn(
        "spotify-gradient border-gray-700 p-6 hover:border-gray-600 transition-colors cursor-pointer transform transition-transform hover:scale-105",
        onClick && "hover:bg-gray-700"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            color
          )}
        >
          {icon}
        </div>
      </div>

      <div className="text-3xl font-bold text-center mb-2 text-white">
        {formatPercentage(percentage)}
      </div>

      <div className="text-center text-gray-300 mb-3">{label}</div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div
          className={cn("h-2 rounded-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className={cn("text-center text-sm font-medium", getTrendColor())}>
        {description}
      </div>
    </Card>
  );
};

export default StatCard;
