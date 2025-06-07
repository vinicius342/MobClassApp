
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Communication } from "@/types/communication";

interface NewCommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCommunication: (communication: Omit<Communication, 'id'>) => void;
}

export function NewCommunicationDialog({ 
  open, 
  onOpenChange, 
  onCreateCommunication 
}: NewCommunicationDialogProps) {
  const [formData, setFormData] = useState<{
    subject: string;
    class: string;
    message: string;
    status: 'sent' | 'scheduled' | 'draft';
  }>({
    subject: "",
    class: "",
    message: "",
    status: "draft"
  });
  const [scheduledDate, setScheduledDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: se status é "scheduled", a data é obrigatória
    if (formData.status === "scheduled" && !scheduledDate) {
      alert("Por favor, selecione uma data para o envio agendado.");
      return;
    }
    
    const now = new Date();
    const date = formData.status === "scheduled" && scheduledDate 
      ? scheduledDate.toLocaleDateString('pt-BR')
      : now.toLocaleDateString('pt-BR');
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const communication: Omit<Communication, 'id'> = {
      ...formData,
      date,
      time,
      readPercentage: 0
    };

    onCreateCommunication(communication);
    
    // Reset form
    setFormData({
      subject: "",
      class: "",
      message: "",
      status: "draft"
    });
    setScheduledDate(undefined);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar data agendada se status não for "scheduled"
    if (field === "status" && value !== "scheduled") {
      setScheduledDate(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Comunicado</DialogTitle>
          <DialogDescription>
            Crie um novo comunicado para enviar aos responsáveis.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Ex: Reunião de Pais"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Turma</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas as turmas">Todas as turmas</SelectItem>
                  <SelectItem value="6º Ano A">6º Ano A</SelectItem>
                  <SelectItem value="6º Ano B">6º Ano B</SelectItem>
                  <SelectItem value="7º Ano A">7º Ano A</SelectItem>
                  <SelectItem value="7º Ano B">7º Ano B</SelectItem>
                  <SelectItem value="8º Ano A">8º Ano A</SelectItem>
                  <SelectItem value="8º Ano B">8º Ano B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Digite aqui o conteúdo do comunicado..."
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Salvar como rascunho</SelectItem>
                <SelectItem value="scheduled">Agendar envio</SelectItem>
                <SelectItem value="sent">Enviar agora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campo de data que aparece quando status é "scheduled" */}
          {formData.status === "scheduled" && (
            <div className="space-y-2">
              <Label>Data do Envio *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : "Selecione a data de envio"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Selecione uma data futura para agendar o envio do comunicado.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Comunicado
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
