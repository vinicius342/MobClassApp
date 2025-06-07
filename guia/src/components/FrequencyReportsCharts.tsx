
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface Student {
  id: string;
  name: string;
  photo?: string;
  presences: number;
  absences: number;
  frequency: number;
  status: "ok" | "attention" | "critical";
}

interface FrequencyData {
  name: string;
  value: number;
  color: string;
}

interface FrequencyReportsChartsProps {
  students: Student[];
}

const FrequencyReportsCharts = ({ students }: FrequencyReportsChartsProps) => {
  const pieData: FrequencyData[] = [
    { name: "Presentes", value: 80, color: "#4CAF50" },
    { name: "Ausentes", value: 20, color: "#F44336" },
  ];

  const barData = students.map(student => ({
    name: student.name.split(" ")[0],
    frequency: student.frequency,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Frequência</CardTitle>
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
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequência por Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrequencyReportsCharts;
