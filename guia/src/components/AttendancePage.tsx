
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon, Search, Users, UserCheck, UserX, Undo2, Save, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Student {
  id: string;
  name: string;
  photo?: string;
  status?: "present" | "absent" | null;
}

export const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Mock data for students
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "Ana Silva Santos", status: null },
    { id: "2", name: "Bruno Costa Oliveira", status: null },
    { id: "3", name: "Carla Mendes Rodrigues", status: null },
    { id: "4", name: "Daniel Ferreira Lima", status: null },
    { id: "5", name: "Elena Souza Martins", status: null },
    { id: "6", name: "Felipe Alves Pereira", status: null },
    { id: "7", name: "Gabriela Santos Cruz", status: null },
    { id: "8", name: "Henrique Lima Nascimento", status: null },
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "present") return matchesSearch && student.status === "present";
    if (filter === "absent") return matchesSearch && student.status === "absent";
    return matchesSearch;
  });

  const presentCount = students.filter(s => s.status === "present").length;
  const absentCount = students.filter(s => s.status === "absent").length;
  const totalStudents = students.length;
  const presentPercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
  const absentPercentage = totalStudents > 0 ? Math.round((absentCount / totalStudents) * 100) : 0;

  const markAttendance = (studentId: string, status: "present" | "absent") => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
    setLastAction(`mark-${status}-${studentId}`);
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: "present" as const })));
    setLastAction("all-present");
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: "absent" as const })));
    setLastAction("all-absent");
  };

  const undoLastAction = () => {
    if (!lastAction) return;

    if (lastAction === "all-present" || lastAction === "all-absent") {
      setStudents(prev => prev.map(student => ({ ...student, status: null })));
    } else if (lastAction.startsWith("mark-")) {
      const studentId = lastAction.split("-")[2];
      setStudents(prev => prev.map(student => 
        student.id === studentId ? { ...student, status: null } : student
      ));
    }
    setLastAction(null);
  };

  const handleSave = () => {
    const unmarkedCount = students.filter(s => s.status === null).length;
    if (unmarkedCount === totalStudents) {
      alert("Por favor, marque pelo menos um aluno antes de salvar.");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    console.log("Salvando frequência...", {
      class: selectedClass,
      subject: selectedSubject,
      date: selectedDate,
      attendance: students.map(s => ({ id: s.id, name: s.name, status: s.status }))
    });
    setShowConfirmDialog(false);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="sticky top-4 z-10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Controles de Frequência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Turma</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7a">7º Ano A</SelectItem>
                  <SelectItem value="7b">7º Ano B</SelectItem>
                  <SelectItem value="8a">8º Ano A</SelectItem>
                  <SelectItem value="8b">8º Ano B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Matemática</SelectItem>
                  <SelectItem value="portuguese">Português</SelectItem>
                  <SelectItem value="science">Ciências</SelectItem>
                  <SelectItem value="history">História</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={markAllPresent} className="bg-green-600 hover:bg-green-700">
              <UserCheck className="mr-2 h-4 w-4" />
              Todos Presentes
            </Button>
            <Button onClick={markAllAbsent} variant="destructive">
              <UserX className="mr-2 h-4 w-4" />
              Todos Ausentes
            </Button>
            <Button 
              onClick={undoLastAction} 
              variant="outline" 
              disabled={!lastAction}
              className="text-gray-600"
            >
              <Undo2 className="mr-2 h-4 w-4" />
              Desfazer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-sm text-gray-600">Presentes ({presentPercentage}%)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <p className="text-sm text-gray-600">Ausentes ({absentPercentage}%)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{totalStudents}</div>
              <p className="text-sm text-gray-600">Total de Alunos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar aluno pelo nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                onClick={() => setFilter("all")}
                size="sm"
              >
                Todos
              </Button>
              <Button 
                variant={filter === "present" ? "default" : "outline"} 
                onClick={() => setFilter("present")}
                size="sm"
                className={filter === "present" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Presentes
              </Button>
              <Button 
                variant={filter === "absent" ? "default" : "outline"} 
                onClick={() => setFilter("absent")}
                size="sm"
                className={filter === "absent" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Ausentes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {student.photo ? (
                      <img src={student.photo} alt={student.name} className="h-10 w-10 rounded-full" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    {student.status && (
                      <Badge 
                        variant={student.status === "present" ? "default" : "destructive"}
                        className={student.status === "present" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {student.status === "present" ? "✅ Presente" : "❌ Ausente"}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => markAttendance(student.id, "present")}
                    size="sm"
                    className={cn(
                      "bg-green-600 hover:bg-green-700",
                      student.status === "present" && "bg-green-700 ring-2 ring-green-300"
                    )}
                    disabled={student.status === "present"}
                  >
                    ✔️ Presente
                  </Button>
                  <Button
                    onClick={() => markAttendance(student.id, "absent")}
                    size="sm"
                    variant="destructive"
                    className={cn(
                      student.status === "absent" && "bg-red-700 ring-2 ring-red-300"
                    )}
                    disabled={student.status === "absent"}
                  >
                    ❌ Ausente
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button onClick={handleSave} size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Save className="mr-2 h-5 w-5" />
          Salvar Frequência
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Salvamento</DialogTitle>
            <DialogDescription>
              Você marcou <strong>{presentCount} presentes ({presentPercentage}%)</strong> e{" "}
              <strong>{absentCount} ausentes ({absentPercentage}%)</strong>.
              <br />
              Deseja confirmar o salvamento da frequência?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSave} className="bg-blue-600 hover:bg-blue-700">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
