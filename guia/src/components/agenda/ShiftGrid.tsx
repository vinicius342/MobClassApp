
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Sunset, Moon } from "lucide-react";
import { Class } from "@/components/AgendaPage";
import { ClassCard } from "./ClassCard";
import { EmptySlotCard } from "./EmptySlotCard";
import { DayHeader } from "./DayHeader";

interface ShiftGridProps {
  shift: "Manhã" | "Tarde" | "Noite";
  classes: Class[];
  onEditClass: (classItem: Class) => void;
  onAddClass: () => void;
  collapsedDays: Set<string>;
  onToggleDayCollapse: (day: string) => void;
}

export const ShiftGrid = ({
  shift,
  classes,
  onEditClass,
  onAddClass,
  collapsedDays,
  onToggleDayCollapse,
}: ShiftGridProps) => {
  const weekDays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  
  const timeSlotsByShift = {
    "Manhã": ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
    "Tarde": ["13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    "Noite": ["19:00", "20:00", "21:00", "22:00", "23:00"]
  };

  const getClassForSlot = (day: string, time: string, shift: string) => {
    return classes.find(c => 
      c.day === day && c.startTime === time && c.shift === shift
    );
  };

  const getShiftIcon = (shift: string) => {
    switch (shift) {
      case "Manhã": return <Sun className="w-4 h-4" />;
      case "Tarde": return <Sunset className="w-4 h-4" />;
      case "Noite": return <Moon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      "Matemática": "bg-blue-100 text-blue-800 border-blue-200",
      "Português": "bg-green-100 text-green-800 border-green-200",
      "História": "bg-purple-100 text-purple-800 border-purple-200",
      "Geografia": "bg-teal-100 text-teal-800 border-teal-200",
      "Ciências": "bg-orange-100 text-orange-800 border-orange-200",
      "Física": "bg-red-100 text-red-800 border-red-200",
      "Química": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Biologia": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Inglês": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Educação Física": "bg-pink-100 text-pink-800 border-pink-200",
      "Artes": "bg-violet-100 text-violet-800 border-violet-200",
      "Intervalo": "bg-gray-100 text-gray-600 border-gray-200"
    };
    return colors[subject as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getShiftIcon(shift)}
          Turno da {shift}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Cabeçalho com dias da semana */}
            <div className="grid grid-cols-6 gap-2 mb-4">
              {weekDays.map(day => (
                <DayHeader
                  key={day}
                  day={day}
                  isCollapsed={collapsedDays.has(day)}
                  onToggle={onToggleDayCollapse}
                />
              ))}
            </div>

            {/* Grade de horários */}
            {timeSlotsByShift[shift].map(time => (
              <div key={time} className="grid grid-cols-6 gap-2 mb-3">
                {weekDays.map(day => {
                  if (collapsedDays.has(day)) {
                    return <div key={day} className="hidden" />;
                  }

                  const classItem = getClassForSlot(day, time, shift);
                  
                  return (
                    <div key={day} className="min-h-[100px]">
                      {classItem ? (
                        <ClassCard
                          classItem={classItem}
                          onEditClass={onEditClass}
                          getSubjectColor={getSubjectColor}
                        />
                      ) : (
                        <EmptySlotCard
                          time={time}
                          onAddClass={onAddClass}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
