
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Class } from "@/components/AgendaPage";
import { AgendaFilters } from "./agenda/AgendaFilters";
import { ShiftTabs } from "./agenda/ShiftTabs";
import { useToast } from "@/hooks/use-toast";

interface AgendaGridViewProps {
  classes: Class[];
  onEditClass: (classItem: Class) => void;
  onAddClass: () => void;
}

export const AgendaGridView = ({
  classes,
  onEditClass,
  onAddClass,
}: AgendaGridViewProps) => {
  const [filterClass, setFilterClass] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

  const { toast } = useToast();

  const uniqueClasses = [...new Set(classes.map(c => c.class))];
  const uniqueTeachers = [...new Set(classes.map(c => c.teacher))];

  const filteredClasses = classes.filter(classItem => {
    const matchesClass = filterClass === "all" || classItem.class === filterClass;
    const matchesTeacher = filterTeacher === "all" || classItem.teacher === filterTeacher;
    return matchesClass && matchesTeacher;
  });

  const toggleDayCollapse = (day: string) => {
    const newCollapsed = new Set(collapsedDays);
    if (newCollapsed.has(day)) {
      newCollapsed.delete(day);
    } else {
      newCollapsed.add(day);
    }
    setCollapsedDays(newCollapsed);
  };

  const handleExportPDF = () => {
    // Aqui seria implementada a lógica de exportação em PDF
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de exportação em PDF em desenvolvimento.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com botão de exportação */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Grade de Aulas por Turnos</h2>
          <p className="text-gray-600 text-sm">Visualize e gerencie a grade de horários por turno</p>
        </div>
        <Button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <AgendaFilters
        filterClass={filterClass}
        setFilterClass={setFilterClass}
        filterTeacher={filterTeacher}
        setFilterTeacher={setFilterTeacher}
        uniqueClasses={uniqueClasses}
        uniqueTeachers={uniqueTeachers}
      />

      <ShiftTabs
        classes={filteredClasses}
        onEditClass={onEditClass}
        onAddClass={onAddClass}
        collapsedDays={collapsedDays}
        onToggleDayCollapse={toggleDayCollapse}
      />
    </div>
  );
};
