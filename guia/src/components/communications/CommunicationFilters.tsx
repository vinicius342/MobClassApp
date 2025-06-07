
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface CommunicationFiltersProps {
  onFilter: (filters: {
    class: string;
    subject: string;
    status: string;
  }) => void;
}

export function CommunicationFilters({ onFilter }: CommunicationFiltersProps) {
  const [filters, setFilters] = useState({
    class: "all",
    subject: "all",
    status: "all"
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      class: "all",
      subject: "all",
      status: "all"
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Turma:</label>
          <Select value={filters.class} onValueChange={(value) => handleFilterChange("class", value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as turmas</SelectItem>
              <SelectItem value="6º Ano B">6º Ano B</SelectItem>
              <SelectItem value="5º Ano A">5º Ano A</SelectItem>
              <SelectItem value="7º Ano A">7º Ano A</SelectItem>
              <SelectItem value="8º Ano C">8º Ano C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Assunto:</label>
          <Select value={filters.subject} onValueChange={(value) => handleFilterChange("subject", value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os assuntos</SelectItem>
              <SelectItem value="Reunião">Reunião</SelectItem>
              <SelectItem value="Evento">Evento</SelectItem>
              <SelectItem value="Aviso">Aviso</SelectItem>
              <SelectItem value="Festa">Festa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status:</label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={clearFilters}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
