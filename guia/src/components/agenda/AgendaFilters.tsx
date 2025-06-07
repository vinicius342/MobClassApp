
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgendaFiltersProps {
  filterClass: string;
  setFilterClass: (value: string) => void;
  filterTeacher: string;
  setFilterTeacher: (value: string) => void;
  uniqueClasses: string[];
  uniqueTeachers: string[];
}

export const AgendaFilters = ({
  filterClass,
  setFilterClass,
  filterTeacher,
  setFilterTeacher,
  uniqueClasses,
  uniqueTeachers,
}: AgendaFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filtros da Grade por Turnos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Turmas</SelectItem>
              {uniqueClasses.map(className => (
                <SelectItem key={className} value={className}>{className}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterTeacher} onValueChange={setFilterTeacher}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Professor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Professores</SelectItem>
              {uniqueTeachers.map(teacher => (
                <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
