
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "@/components/StatsCard";
import { AttendanceChart } from "@/components/AttendanceChart";
import { GradesChart } from "@/components/GradesChart";

export function Dashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo(a), Administrador Essencia!
          </h1>
        </div>
        <div className="text-sm text-gray-600">
          Olá, <span className="font-medium">Administrador Essencia</span> (administradores)
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Alunos"
          value="41"
          icon="👨‍🎓"
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Professores"
          value="8"
          icon="👨‍🏫"
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Turmas"
          value="5"
          icon="👥"
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Atividades"
          value="18"
          icon="📋"
          bgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select defaultValue="todas">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione as turmas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Turmas</SelectItem>
            <SelectItem value="6a">6º Ano A</SelectItem>
            <SelectItem value="6b">6º Ano B</SelectItem>
            <SelectItem value="7a">7º Ano A</SelectItem>
            <SelectItem value="8a">8º Ano A</SelectItem>
            <SelectItem value="9a">9º Ano A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <GradesChart />
      </div>
    </div>
  );
}
