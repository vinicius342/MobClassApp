
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export function StatsCard({ title, value, icon, bgColor, iconColor }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <span className={`text-2xl ${iconColor}`}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
