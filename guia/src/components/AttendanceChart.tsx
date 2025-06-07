
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "6º Ano A",
    frequency: 0,
    label: "0%"
  },
  {
    name: "6º Ano B", 
    frequency: 0,
    label: "0%"
  },
  {
    name: "7º Ano A",
    frequency: 90.91,
    label: "90.91%"
  },
  {
    name: "8º Ano A",
    frequency: 0,
    label: "0%"
  },
  {
    name: "9º Ano A",
    frequency: 0,
    label: "0%"
  }
];

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Taxa de Frequência por Turma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar 
              dataKey="frequency" 
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
