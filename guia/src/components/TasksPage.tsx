import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Filter, Download, Eye, Check, X, Clock, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Entrega {
  id: string;
  alunoId: string;
  tarefaId: string;
  dataEntrega: string;
  status: string;
  dataConclusao?: string;
  anexoUrl?: string;
  observacoes?: string;
}


interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
}

interface Tarefa {
  id: string;
  materiaId: string;
  descricao: string;
  turmaId: string;
  dataEntrega: string;
}

interface Turma {
  id: string;
  nome: string;
}

interface Materia {
  id: string;
  nome: string;
}

interface Vinculo {
  professorId: string;
  materiaId: string;
  turmaId: string;
}

const turmas = ["6º Ano A", "6º Ano B", "7º Ano A", "8º Ano A", "9º Ano A"];
const materias = ["Matemática", "Português", "História", "Geografia", "Ciências", "Inglês"];

const alunosExemplo = [
  { id: "1", nome: "Ana Silva" },
  { id: "2", nome: "Bruno Santos" },
  { id: "3", nome: "Carlos Oliveira" },
  { id: "4", nome: "Diana Costa" },
  { id: "5", nome: "Eduardo Lima" },
];

export function TasksPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    turma: "",
    materia: "",
    titulo: "",
    descricao: "",
    dataEntrega: undefined as Date | undefined
  });

  // Filter states
  const [filters, setFilters] = useState({
    turma: "all",
    materia: "all",
    atividade: ""
  });

  const handleSaveActivity = () => {
    if (!formData.turma || !formData.materia || !formData.titulo || !formData.descricao || !formData.dataEntrega) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      turma: formData.turma,
      materia: formData.materia,
      titulo: formData.titulo,
      descricao: formData.descricao,
      dataEntrega: formData.dataEntrega,
      alunos: alunosExemplo.map(aluno => ({
        ...aluno,
        concluida: false,
        status: 'nao-concluido' as const
      }))
    };

    setActivities([...activities, newActivity]);
    setFormData({
      turma: "",
      materia: "",
      titulo: "",
      descricao: "",
      dataEntrega: undefined
    });
    
    console.log("Atividade cadastrada:", newActivity);
  };

  const updateStudentStatus = (studentId: string, newStatus: ActivityStudent['status'], observacoes?: string) => {
    if (!selectedActivity) return;

    const updatedActivities = activities.map(activity => {
      if (activity.id === selectedActivity.id) {
        const updatedAlunos = activity.alunos.map(aluno => {
          if (aluno.id === studentId) {
            return {
              ...aluno,
              status: newStatus,
              observacoes: observacoes || aluno.observacoes
            };
          }
          return aluno;
        });
        return { ...activity, alunos: updatedAlunos };
      }
      return activity;
    });

    setActivities(updatedActivities);
    setSelectedActivity(updatedActivities.find(a => a.id === selectedActivity.id) || null);
  };

  const getStatusColor = (status: ActivityStudent['status']) => {
    switch (status) {
      case 'concluido-conferido':
        return 'text-green-600';
      case 'concluido-nao-conferido':
        return 'text-yellow-600';
      case 'nao-entregue':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: ActivityStudent['status']) => {
    switch (status) {
      case 'concluido-conferido':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'concluido-nao-conferido':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'nao-entregue':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <X className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    return (filters.turma === "all" || activity.turma === filters.turma) &&
           (filters.materia === "all" || activity.materia === filters.materia);
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header com identidade visual */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#083c71' }}>
          <img 
            src="/lovable-uploads/3b2f2fd7-5e6b-4b80-8396-fe8fe9d8e05e.png" 
            alt="MobClassApp Logo" 
            className="w-8 h-8 object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#083c71' }}>Gerenciamento de Tarefas</h1>
          <p className="text-sm text-gray-600">MobClassApp - Portal do Professor</p>
        </div>
      </div>

      {/* Tabs para separar Cadastro e Acompanhamento */}
      <Tabs defaultValue="cadastro" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cadastro" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Cadastro de Atividade
          </TabsTrigger>
          <TabsTrigger value="acompanhamento" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Acompanhamento
          </TabsTrigger>
        </TabsList>

        {/* Tab de Cadastro */}
        <TabsContent value="cadastro">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#083c71' }}>
                <Plus className="w-5 h-5" />
                Cadastro de Atividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="turma">Turma *</Label>
                  <Select value={formData.turma} onValueChange={(value) => setFormData({...formData, turma: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {turmas.map(turma => (
                        <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="materia">Matéria/Disciplina *</Label>
                  <Select value={formData.materia} onValueChange={(value) => setFormData({...formData, materia: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {materias.map(materia => (
                        <SelectItem key={materia} value={materia}>{materia}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Atividade *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  placeholder="Digite o título da atividade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Atividade *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva a atividade..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Entrega *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dataEntrega && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataEntrega ? format(formData.dataEntrega, "dd/MM/yyyy") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dataEntrega}
                      onSelect={(date) => setFormData({...formData, dataEntrega: date})}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button 
                onClick={handleSaveActivity} 
                className="w-full"
                style={{ backgroundColor: '#083c71' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Salvar Atividade
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Acompanhamento */}
        <TabsContent value="acompanhamento">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: '#083c71' }}>
                <GraduationCap className="w-5 h-5" />
                Acompanhamento de Atividades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label>Filtrar por Turma</Label>
                  <Select value={filters.turma} onValueChange={(value) => setFilters({...filters, turma: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as turmas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as turmas</SelectItem>
                      {turmas.map(turma => (
                        <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Filtrar por Matéria</Label>
                  <Select value={filters.materia} onValueChange={(value) => setFilters({...filters, materia: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as matérias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as matérias</SelectItem>
                      {materias.map(materia => (
                        <SelectItem key={materia} value={materia}>{materia}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Selecionar Atividade</Label>
                  <Select 
                    value={selectedActivity?.id || ""} 
                    onValueChange={(value) => {
                      const activity = activities.find(a => a.id === value);
                      setSelectedActivity(activity || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredActivities.map(activity => (
                        <SelectItem key={activity.id} value={activity.id}>
                          {activity.titulo} - {activity.turma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de Atividades */}
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma atividade cadastrada ainda.</p>
                  <p className="text-sm">Cadastre uma atividade na aba "Cadastro" para começar o acompanhamento.</p>
                </div>
              ) : selectedActivity ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(8, 60, 113, 0.1)' }}>
                    <h3 className="font-semibold" style={{ color: '#083c71' }}>{selectedActivity.titulo}</h3>
                    <p style={{ color: '#083c71' }}>{selectedActivity.turma} - {selectedActivity.materia}</p>
                    <p className="text-sm text-gray-600">Entrega: {format(selectedActivity.dataEntrega, "dd/MM/yyyy")}</p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Data Conclusão</TableHead>
                        <TableHead>Anexo</TableHead>
                        <TableHead>Observações</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedActivity.alunos.map((aluno) => (
                        <TableRow key={aluno.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(aluno.status)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell>
                            {aluno.dataConlusao ? format(aluno.dataConlusao, "dd/MM/yyyy HH:mm") : "-"}
                          </TableCell>
                          <TableCell>
                            {aluno.anexo ? (
                              <Button variant="outline" size="sm">Ver Anexo</Button>
                            ) : (
                              <span className="text-gray-400">Sem anexo</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Observações..."
                              value={aluno.observacoes || ""}
                              onChange={(e) => {
                                const updatedActivities = activities.map(activity => {
                                  if (activity.id === selectedActivity.id) {
                                    const updatedAlunos = activity.alunos.map(a => {
                                      if (a.id === aluno.id) {
                                        return { ...a, observacoes: e.target.value };
                                      }
                                      return a;
                                    });
                                    return { ...activity, alunos: updatedAlunos };
                                  }
                                  return activity;
                                });
                                setActivities(updatedActivities);
                                setSelectedActivity(updatedActivities.find(a => a.id === selectedActivity.id) || null);
                              }}
                              className="max-w-xs"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateStudentStatus(aluno.id, 'concluido-conferido')}
                                className="text-green-600 hover:bg-green-50"
                              >
                                Confirmar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateStudentStatus(aluno.id, 'nao-entregue')}
                                className="text-red-600 hover:bg-red-50"
                              >
                                Não Entregue
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Selecione uma atividade para acompanhar as entregas dos alunos.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
