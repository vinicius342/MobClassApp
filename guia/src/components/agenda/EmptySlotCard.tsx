
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface EmptySlotCardProps {
  time: string;
  onAddClass: () => void;
}

export const EmptySlotCard = ({ time, onAddClass }: EmptySlotCardProps) => {
  return (
    <Card className="h-full border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="text-xs font-medium text-gray-500 text-center">
          {time}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddClass}
          className="text-gray-500 hover:text-blue-600 self-center"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
