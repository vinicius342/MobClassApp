
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { Class } from "@/components/AgendaPage";

interface ClassCardProps {
  classItem: Class;
  onEditClass: (classItem: Class) => void;
  getSubjectColor: (subject: string) => string;
}

export const ClassCard = ({ classItem, onEditClass, getSubjectColor }: ClassCardProps) => {
  return (
    <Card className={`h-full cursor-pointer hover:shadow-md transition-shadow ${getSubjectColor(classItem.subject)}`}>
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="space-y-1">
          {/* Horário */}
          <div className="text-xs font-bold text-gray-700">
            {classItem.startTime} - {classItem.endTime}
          </div>
          
          {/* Disciplina */}
          <div className="font-medium text-sm">
            {classItem.subject}
          </div>
          
          {/* Professor */}
          <div className="text-xs text-gray-600">
            {classItem.teacher}
          </div>
          
          {/* Sala e Turma */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {classItem.class}
            </Badge>
            {classItem.room && (
              <Badge variant="outline" className="text-xs">
                {classItem.room}
              </Badge>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditClass(classItem)}
          className="self-end p-1 h-auto mt-2"
        >
          <Edit className="w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
};
