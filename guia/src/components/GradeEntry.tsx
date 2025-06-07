
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Save, Search, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface StudentGrade {
  id: string;
  name: string;
  partial: string;
  global: string;
  participation: string;
  recovery: string;
  saved: boolean;
}

export const GradeEntry = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  
  const [students, setStudents] = useState<StudentGrade[]>([
    { id: "1", name: "Ana Silva", partial: "", global: "", participation: "", recovery: "", saved: false },
    { id: "2", name: "Bruno Santos", partial: "8.5", global: "7.0", participation: "9.0", recovery: "", saved: true },
    { id: "3", name: "Carlos Oliveira", partial: "", global: "", participation: "", recovery: "", saved: false },
    { id: "4", name: "Diana Costa", partial: "9.0", global: "8.5", participation: "10.0", recovery: "", saved: true },
    { id: "5", name: "Eduardo Lima", partial: "", global: "", participation: "", recovery: "", saved: false },
    { id: "6", name: "Fernanda Santos", partial: "", global: "", participation: "", recovery: "", saved: false },
    { id: "7", name: "Gabriel Oliveira", partial: "7.5", global: "6.0", participation: "8.0", recovery: "", saved: true },
    { id: "8", name: "Helena Costa", partial: "", global: "", participation: "", recovery: "", saved: false },
  ]);

  const filledStudents = students.filter(student => 
    student.partial !== "" || student.global !== "" || student.participation !== "" || student.recovery !== ""
  ).length;

  const validateGrade = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 10;
  };

  const updateStudentGrade = (id: string, field: keyof StudentGrade, value: string) => {
    if (field !== "name" && field !== "id" && field !== "saved" && value !== "") {
      if (!validateGrade(value)) {
        toast({
          title: "Nota inválida",
          description: "As notas devem ser entre 0 e 10",
          variant: "destructive",
        });
        return;
      }
    }

    setStudents(prev => prev.map(student => 
      student.id === id 
        ? { ...student, [field]: value, saved: false }
        : student
    ));
  };

  const saveStudentGrade = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;

    // Validar se pelo menos uma nota foi preenchida
    if (!student.partial && !student.global && !student.participation && !student.recovery) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha pelo menos uma nota antes de salvar",
        variant: "destructive",
      });
      return;
    }

    setStudents(prev => prev.map(student => 
      student.id === id 
        ? { ...student, saved: true }
        : student
    ));

    toast({
      title: "Sucesso",
      description: `Notas de ${student.name} salvas com sucesso!`,
    });
  };

  const saveAllGrades = () => {
    const unsavedStudents = students.filter(s => !s.saved && (s.partial || s.global || s.participation || s.recovery));
    
    if (unsavedStudents.length === 0) {
      toast({
        title: "Nenhuma alteração",
        description: "Não há notas pendentes para salvar",
      });
      return;
    }

    setStudents(prev => prev.map(student => ({ ...student, saved: true })));
    
    toast({
      title: "Sucesso",
      description: `Notas de ${unsavedStudents.length} aluno(s) salvas com sucesso!`,
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  const progressPercentage = students.length > 0 ? (filledStudents / students.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Turma</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
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
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
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
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso de Preenchimento</span>
            <span className="text-sm text-gray-600">{filledStudents}/{students.length} alunos</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

      {/* Tabela de Lançamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lançamento de Notas</CardTitle>
          <Button onClick={saveAllGrades} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            Salvar Tudo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Nome do Aluno</TableHead>
                  <TableHead>Parcial (0-10)</TableHead>
                  <TableHead>Global (0-10)</TableHead>
                  <TableHead>Participação (0-10)</TableHead>
                  <TableHead>Recuperação (0-10)</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {student.saved ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          (student.partial || student.global || student.participation || student.recovery) && (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )
                        )}
                        {student.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={student.partial}
                        onChange={(e) => updateStudentGrade(student.id, "partial", e.target.value)}
                        className="w-20"
                        placeholder="0.0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={student.global}
                        onChange={(e) => updateStudentGrade(student.id, "global", e.target.value)}
                        className="w-20"
                        placeholder="0.0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={student.participation}
                        onChange={(e) => updateStudentGrade(student.id, "participation", e.target.value)}
                        className="w-20"
                        placeholder="0.0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={student.recovery}
                        onChange={(e) => updateStudentGrade(student.id, "recovery", e.target.value)}
                        className="w-20"
                        placeholder="0.0"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => saveStudentGrade(student.id)}
                        disabled={student.saved}
                        variant={student.saved ? "outline" : "default"}
                        className={student.saved ? "text-green-600" : ""}
                      >
                        {student.saved ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
