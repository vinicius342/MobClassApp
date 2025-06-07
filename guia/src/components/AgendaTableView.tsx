
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Copy, MoreHorizontal, Search, Filter, Upload } from "lucide-react";
import { Class } from "@/components/AgendaPage";
import { useToast } from "@/hooks/use-toast";

interface AgendaTableViewProps {
  classes: Class[];
  onEditClass: (classData: Class) => void;
  onDeleteClass: (id: string) => void;
  onDuplicateClass: (classData: Class) => void;
}

export const AgendaTableView = ({
  classes,
  onEditClass,
  onDeleteClass,
  onDuplicateClass,
}: AgendaTableViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTurma, setFilterTurma] = useState("all");
  const [filterProfessor, setFilterProfessor] = useState("all");
  const [filterTurno, setFilterTurno] = useState("all");
  const [filterDia, setFilterDia] = useState("all");

  const { toast } = useToast();

  const uniqueTurmas = [...new Set(classes.map(c => c.class))];
  const uniqueProfessors = [...new Set(classes.map(c => c.teacher))];
  const uniqueTurnos = [...new Set(classes.map(c => c.shift))];
  const uniqueDias = [...new Set(classes.map(c => c.day))];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTurma = filterTurma === "all" || classItem.class === filterTurma;
    const matchesProfessor = filterProfessor === "all" || classItem.teacher === filterProfessor;
    const matchesTurno = filterTurno === "all" || classItem.shift === filterTurno;
    const matchesDia = filterDia === "all" || classItem.day === filterDia;

    return matchesSearch && matchesTurma && matchesProfessor && matchesTurno && matchesDia;
  });

  const handleDelete = (id: string) => {
    onDeleteClass(id);
    toast({
      title: "Sucesso",
      description: "Aula excluída com sucesso!",
    });
  };

  const handleDuplicate = (classData: Class) => {
    onDuplicateClass(classData);
    toast({
      title: "Sucesso",
      description: "Aula duplicada com sucesso!",
    });
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui seria implementada a lógica de importação
      toast({
        title: "Em desenvolvimento",
        description: "Funcionalidade de importação em desenvolvimento.",
      });
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "Manhã":
        return "bg-yellow-100 text-yellow-800";
      case "Tarde":
        return "bg-orange-100 text-orange-800";
      case "Noite":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Botão de Importação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Importar Agenda
            <div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImportFile}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Excel/CSV
                  </span>
                </Button>
              </label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Importe aulas em massa através de arquivo Excel (.xlsx) ou CSV. 
            O arquivo deve conter as colunas: Dia, Horário Início, Horário Fim, Disciplina, Professor, Turma, Turno, Sala.
          </p>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar aulas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterTurma} onValueChange={setFilterTurma}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Turmas</SelectItem>
                {uniqueTurmas.map(turma => (
                  <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterProfessor} onValueChange={setFilterProfessor}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Professor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Professores</SelectItem>
                {uniqueProfessors.map(professor => (
                  <SelectItem key={professor} value={professor}>{professor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTurno} onValueChange={setFilterTurno}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Turnos</SelectItem>
                {uniqueTurnos.map(turno => (
                  <SelectItem key={turno} value={turno}>{turno}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDia} onValueChange={setFilterDia}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Dias</SelectItem>
                {uniqueDias.map(dia => (
                  <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilterTurma("all");
                setFilterProfessor("all");
                setFilterTurno("all");
                setFilterDia("all");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Aulas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Aulas ({filteredClasses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turno</TableHead>
                  <TableHead>Dia da Semana</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Nenhuma aula encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell>
                        <Badge className={getShiftColor(classItem.shift)}>
                          {classItem.shift}
                        </Badge>
                      </TableCell>
                      <TableCell>{classItem.day}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{classItem.startTime} - {classItem.endTime}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{classItem.subject}</TableCell>
                      <TableCell>{classItem.teacher}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{classItem.class}</Badge>
                      </TableCell>
                      <TableCell>{classItem.room || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onEditClass(classItem)}
                              className="cursor-pointer"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(classItem)}
                              className="cursor-pointer"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(classItem.id)}
                              className="cursor-pointer text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
