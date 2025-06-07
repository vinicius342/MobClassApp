import { useState } from "react";
import { GradeReportsStats } from "@/components/GradeReportsStats";
import { GradeReportsFilters } from "@/components/GradeReportsFilters";
import { GradeReportsTable } from "@/components/GradeReportsTable";
import { GradeReportsCharts } from "@/components/GradeReportsCharts";
import { GradeReportsActions } from "@/components/GradeReportsActions";
import { StudentReport, GradeReportsFilters as FiltersType } from "@/types/gradeReports";

export const GradeReports = () => {
  const [filters, setFilters] = useState<FiltersType>({
    selectedClass: "",
    selectedSubject: "",
    selectedSemester: "",
    searchStudent: "",
    sortBy: "name"
  });

  const students: StudentReport[] = [
    { 
      id: "1",
      name: "João Silva", 
      partial: 9.0,
      global: 9.5,
      participation: 10.0,
      recovery: 0,
      average: 9.5,
      entryDate: "2024-01-15"
    },
    { 
      id: "2",
      name: "Maria Santos", 
      partial: 8.5,
      global: 7.5,
      participation: 8.0,
      recovery: 0,
      average: 8.0,
      entryDate: "2024-01-15"
    },
    { 
      id: "3",
      name: "Carlos Oliveira", 
      partial: 5.0,
      global: 6.0,
      participation: 5.5,
      recovery: 7.0,
      average: 6.5,
      entryDate: "2024-01-15"
    },
    { 
      id: "4",
      name: "Ana Costa", 
      partial: 8.0,
      global: 8.5,
      participation: 9.0,
      recovery: 0,
      average: 8.5,
      entryDate: "2024-01-15"
    },
    { 
      id: "5",
      name: "Pedro Lima", 
      partial: 4.5,
      global: 5.0,
      participation: 4.0,
      recovery: 6.0,
      average: 5.2,
      entryDate: "2024-01-15"
    },
  ];

  const filteredStudents = students.filter(student => {
    if (filters.searchStudent && !student.name.toLowerCase().includes(filters.searchStudent.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case "average":
        return b.average - a.average;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <GradeReportsFilters filters={filters} setFilters={setFilters} />

      {/* Estatísticas */}
      <GradeReportsStats students={filteredStudents} />

      {/* Gráficos */}
      <GradeReportsCharts students={filteredStudents} />

      {/* Ações de Exportação */}
      <GradeReportsActions />

      {/* Tabela de Notas */}
      <GradeReportsTable students={filteredStudents} />
    </div>
  );
};
