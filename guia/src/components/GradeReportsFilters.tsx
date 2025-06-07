
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { GradeReportsFilters as FiltersType } from "@/types/gradeReports";

interface GradeReportsFiltersProps {
  filters: FiltersType;
  setFilters: (filters: FiltersType) => void;
}

export const GradeReportsFilters = ({ filters, setFilters }: GradeReportsFiltersProps) => {
  const clearFilters = () => {
    setFilters({
      selectedClass: "",
      selectedSubject: "",
      selectedSemester: "",
      searchStudent: "",
      sortBy: "name"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Turma</label>
            <Select 
              value={filters.selectedClass} 
              onValueChange={(value) => setFilters({...filters, selectedClass: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3a">3º Ano A</SelectItem>
                <SelectItem value="3b">3º Ano B</SelectItem>
                <SelectItem value="2a">2º Ano A</SelectItem>
                <SelectItem value="2b">2º Ano B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Matéria</label>
            <Select 
              value={filters.selectedSubject} 
              onValueChange={(value) => setFilters({...filters, selectedSubject: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a matéria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matematica">Matemática</SelectItem>
                <SelectItem value="portugues">Português</SelectItem>
                <SelectItem value="historia">História</SelectItem>
                <SelectItem value="ciencias">Ciências</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Bimestre</label>
            <Select 
              value={filters.selectedSemester} 
              onValueChange={(value) => setFilters({...filters, selectedSemester: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o bimestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1º Bimestre</SelectItem>
                <SelectItem value="2">2º Bimestre</SelectItem>
                <SelectItem value="3">3º Bimestre</SelectItem>
                <SelectItem value="4">4º Bimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Buscar Aluno</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nome do aluno..."
                value={filters.searchStudent}
                onChange={(e) => setFilters({...filters, searchStudent: e.target.value})}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ordenar por</label>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => setFilters({...filters, sortBy: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="average">Média</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
