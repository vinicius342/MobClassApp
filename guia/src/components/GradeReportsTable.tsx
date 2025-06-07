
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Plus } from "lucide-react";
import { StudentReport } from "@/types/gradeReports";

interface GradeReportsTableProps {
  students: StudentReport[];
}

export const GradeReportsTable = ({ students }: GradeReportsTableProps) => {
  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-600 font-semibold";
    if (grade >= 6) return "text-yellow-600";
    return "text-red-600 font-semibold";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório Detalhado de Notas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Nome do Aluno</TableHead>
                <TableHead className="text-center">Parcial</TableHead>
                <TableHead className="text-center">Global</TableHead>
                <TableHead className="text-center">Participação</TableHead>
                <TableHead className="text-center">Recuperação</TableHead>
                <TableHead className="text-center">Média Final</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Data Lançamento</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className={`text-center ${getGradeColor(student.partial)}`}>
                    {student.partial.toFixed(1)}
                  </TableCell>
                  <TableCell className={`text-center ${getGradeColor(student.global)}`}>
                    {student.global.toFixed(1)}
                  </TableCell>
                  <TableCell className={`text-center ${getGradeColor(student.participation)}`}>
                    {student.participation.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.recovery > 0 ? (
                      <span className={getGradeColor(student.recovery)}>{student.recovery.toFixed(1)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className={`text-center font-bold ${getGradeColor(student.average)}`}>
                    {student.average.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.average >= 7 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Aprovado
                      </Badge>
                    ) : student.average >= 5 ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Recuperação
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        Reprovado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {formatDate(student.entryDate)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center">
                      {student.recovery === 0 && student.average < 7 && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Plus className="h-3 w-3 mr-1" />
                          Recuperação
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-xs">
                        <History className="h-3 w-3 mr-1" />
                        Histórico
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
