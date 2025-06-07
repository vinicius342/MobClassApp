
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { UserIcon } from "lucide-react";

interface Student {
  id: string;
  name: string;
  photo?: string;
  presences: number;
  absences: number;
  frequency: number;
  status: "ok" | "attention" | "critical";
}

interface FrequencyReportsTableProps {
  students: Student[];
  isLoading: boolean;
  onStudentClick: (student: Student) => void;
}

const FrequencyReportsTable = ({ students, isLoading, onStudentClick }: FrequencyReportsTableProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Lista de Alunos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-right">Presenças</TableHead>
                  <TableHead className="text-right">Faltas</TableHead>
                  <TableHead>Frequência (%)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div 
                        className="flex items-center space-x-3 cursor-pointer hover:text-blue-600"
                        onClick={() => onStudentClick(student)}
                      >
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {student.photo ? (
                            <img src={student.photo} alt={student.name} className="h-8 w-8 rounded-full" />
                          ) : (
                            <UserIcon className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {student.presences}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {student.absences}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={student.frequency} className="flex-1" />
                        <span className="text-sm font-medium min-w-[40px]">{student.frequency}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(student.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FrequencyReportsTable;
