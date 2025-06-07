
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class } from "@/components/AgendaPage";
import { useToast } from "@/hooks/use-toast";

interface NewClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (classData: Class | Omit<Class, "id">) => void;
  editingClass?: Class | null;
}

export const NewClassDialog = ({
  open,
  onOpenChange,
  onSave,
  editingClass,
}: NewClassDialogProps) => {
  const [formData, setFormData] = useState({
    day: "",
    startTime: "",
    endTime: "",
    subject: "",
    teacher: "",
    class: "",
    shift: "" as "Manhã" | "Tarde" | "Noite" | "",
    room: "",
  });

  const { toast } = useToast();

  const weekDays = [
    "Segunda-feira",
    "Terça-feira", 
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];

  const shifts = ["Manhã", "Tarde", "Noite"];

  const subjects = [
    "Matemática",
    "Português", 
    "História",
    "Geografia",
    "Ciências",
    "Física",
    "Química",
    "Biologia",
    "Inglês",
    "Educação Física",
    "Artes"
  ];

  const teachers = [
    "Prof. João Silva",
    "Prof. Maria Santos", 
    "Prof. Carlos Lima",
    "Prof. Ana Costa",
    "Prof. Pedro Oliveira",
    "Prof. Lucia Fernandes",
    "Prof. Roberto Souza",
    "Prof. Juliana Alves",
    "Prof. Francisco Gomes",
    "Prof. Mariana Ribeiro"
  ];

  const classes = [
    "6º A", "6º B", "6º C",
    "7º A", "7º B", "7º C", 
    "8º A", "8º B", "8º C",
    "9º A", "9º B", "9º C",
    "1º Ano", "2º Ano", "3º Ano",
    "EJA A", "EJA B"
  ];

  const rooms = [
    "Sala 101", "Sala 102", "Sala 103", "Sala 104", "Sala 105",
    "Laboratório de Ciências", "Laboratório de Informática",
    "Biblioteca", "Quadra de Esportes", "Auditório"
  ];

  useEffect(() => {
    if (editingClass) {
      setFormData({
        day: editingClass.day,
        startTime: editingClass.startTime,
        endTime: editingClass.endTime,
        subject: editingClass.subject,
        teacher: editingClass.teacher,
        class: editingClass.class,
        shift: editingClass.shift,
        room: editingClass.room || "",
      });
    } else {
      setFormData({
        day: "",
        startTime: "",
        endTime: "",
        subject: "",
        teacher: "",
        class: "",
        shift: "",
        room: "",
      });
    }
  }, [editingClass, open]);

  const validateTimeFormat = (time: string) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const validateShiftTime = (time: string, shift: string) => {
    if (!time || !shift) return true;
    
    const [hours] = time.split(':').map(Number);
    
    switch (shift) {
      case "Manhã":
        return hours >= 6 && hours < 12;
      case "Tarde":
        return hours >= 12 && hours < 18;
      case "Noite":
        return hours >= 18 || hours < 6;
      default:
        return true;
    }
  };

  const handleSave = () => {
    // Validação básica
    if (!formData.day || !formData.startTime || !formData.endTime || 
        !formData.subject || !formData.teacher || !formData.class || !formData.shift) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação de formato de horário
    if (!validateTimeFormat(formData.startTime) || !validateTimeFormat(formData.endTime)) {
      toast({
        title: "Erro",
        description: "Por favor, insira horários válidos no formato HH:MM (ex: 08:00).",
        variant: "destructive",
      });
      return;
    }

    // Validação de horário
    if (formData.startTime >= formData.endTime) {
      toast({
        title: "Erro",
        description: "O horário de início deve ser anterior ao horário de término.",
        variant: "destructive",
      });
      return;
    }

    // Validação de turno x horário
    if (!validateShiftTime(formData.startTime, formData.shift) || !validateShiftTime(formData.endTime, formData.shift)) {
      toast({
        title: "Erro",
        description: `Os horários selecionados não são compatíveis com o turno da ${formData.shift}.`,
        variant: "destructive",
      });
      return;
    }

    if (editingClass) {
      onSave({ ...formData, id: editingClass.id } as Class);
      toast({
        title: "Sucesso",
        description: "Aula atualizada com sucesso!",
      });
    } else {
      onSave(formData as Omit<Class, "id">);
      toast({
        title: "Sucesso", 
        description: "Nova aula criada com sucesso!",
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClass ? "Editar Aula" : "Adicionar Nova Aula"}
          </DialogTitle>
          <DialogDescription>
            {editingClass 
              ? "Edite as informações da aula abaixo."
              : "Preencha as informações para criar uma nova aula."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="shift">Turno *</Label>
            <Select 
              value={formData.shift} 
              onValueChange={(value) => setFormData({
                ...formData, 
                shift: value as "Manhã" | "Tarde" | "Noite"
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                {shifts.map(shift => (
                  <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="day">Dia da Semana *</Label>
            <Select value={formData.day} onValueChange={(value) => setFormData({...formData, day: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Horário Início *</Label>
              <Input
                id="startTime"
                placeholder="08:00"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
              <p className="text-xs text-gray-500">Formato: HH:MM (ex: 08:00)</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">Horário Fim *</Label>
              <Input
                id="endTime"
                placeholder="09:00"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
              <p className="text-xs text-gray-500">Formato: HH:MM (ex: 09:00)</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Disciplina *</Label>
            <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a disciplina" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="teacher">Professor *</Label>
            <Select value={formData.teacher} onValueChange={(value) => setFormData({...formData, teacher: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o professor" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="class">Turma *</Label>
            <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(className => (
                  <SelectItem key={className} value={className}>{className}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="room">Sala</Label>
            <Select value={formData.room} onValueChange={(value) => setFormData({...formData, room: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room} value={room}>{room}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {editingClass ? "Atualizar" : "Criar"} Aula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
