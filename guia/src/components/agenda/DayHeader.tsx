
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DayHeaderProps {
  day: string;
  isCollapsed: boolean;
  onToggle: (day: string) => void;
}

export const DayHeader = ({ day, isCollapsed, onToggle }: DayHeaderProps) => {
  return (
    <div className="text-center">
      <Button
        variant="ghost"
        onClick={() => onToggle(day)}
        className="flex items-center gap-1 w-full justify-center font-semibold text-gray-700 text-xs"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        <span className="hidden lg:inline">{day}</span>
        <span className="lg:hidden">{day.slice(0, 3)}</span>
      </Button>
    </div>
  );
};
