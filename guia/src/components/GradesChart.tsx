
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Dot } from "recharts";

const data = [
  {
    name: "Redação",
    grade: 3
  },
  {
    name: "Gramática", 
    grade: 3.2
  },
  {
    name: "Cálculo",
    grade: 4.5
  },
  {
    name: "Matemática",
    grade: 4.8
  },
  {
    name: "Química",
    grade: 5.8
  }
];

export function GradesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Nota Média por Matéria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              domain={[0, 10]}
            />
            <Line 
              type="monotone" 
              dataKey="grade" 
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">média</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
