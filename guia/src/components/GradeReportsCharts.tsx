
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { StudentReport } from "@/types/gradeReports";

interface GradeReportsChartsProps {
  students: StudentReport[];
}

export const GradeReportsCharts = ({ students }: GradeReportsChartsProps) => {
  const excellentStudents = students.filter(s => s.average >= 9).length;
  const regularStudents = students.filter(s => s.average >= 6 && s.average < 9).length;
  const lowGradeStudents = students.filter(s => s.average < 6).length;

  const pieData = [
    { name: "Excelentes (≥9)", value: excellentStudents, color: "#22c55e" },
    { name: "Regulares (6-8.9)", value: regularStudents, color: "#eab308" },
    { name: "Nota Baixa (<6)", value: lowGradeStudents, color: "#ef4444" },
  ];

  const barData = students.map(student => ({
    name: student.name.split(" ")[0],
    media: student.average,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Faixa de Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Médias por Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="media" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
