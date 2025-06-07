
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Award, AlertTriangle } from "lucide-react";
import { StudentReport } from "@/types/gradeReports";

interface GradeReportsStatsProps {
  students: StudentReport[];
}

export const GradeReportsStats = ({ students }: GradeReportsStatsProps) => {
  const excellentStudents = students.filter(s => s.average >= 9).length;
  const regularStudents = students.filter(s => s.average >= 6 && s.average < 9).length;
  const lowGradeStudents = students.filter(s => s.average < 6).length;
  const overallAverage =
    students.reduce((sum, s) => sum + s.average, 0) / students.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Média Geral</p>
              <p className="text-2xl font-bold">{overallAverage.toFixed(1)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Excelentes (≥9)</p>
              <p className="text-2xl font-bold text-green-600">
                {excellentStudents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Regulares (6-8.9)
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {regularStudents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Nota Baixa (&lt;6)
              </p>
              <p className="text-2xl font-bold text-red-600">
                {lowGradeStudents}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

