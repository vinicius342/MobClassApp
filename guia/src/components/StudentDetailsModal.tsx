
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Student {
  id: string;
  name: string;
  photo?: string;
  presences: number;
  absences: number;
  frequency: number;
  status: "ok" | "attention" | "critical";
}

interface StudentDetailsModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailsModal = ({ student, isOpen, onClose }: StudentDetailsModalProps) => {
  if (!student) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ OK</Badge>;
      case "attention":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⚠️ Atenção</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">❌ Crítico</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Histórico de Frequência - {student.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total de Presenças</Label>
              <p className="text-2xl font-bold text-green-600">{student.presences}</p>
            </div>
            <div>
              <Label>Total de Faltas</Label>
              <p className="text-2xl font-bold text-red-600">{student.absences}</p>
            </div>
          </div>
          <div>
            <Label>Frequência Geral</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Progress value={student.frequency} className="flex-1" />
              <span className="text-sm font-medium">{student.frequency}%</span>
            </div>
          </div>
          {getStatusBadge(student.status)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
