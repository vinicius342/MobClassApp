
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendancePage } from "@/components/AttendancePage";
import ReportsPage from "@/components/ReportsPage";

const FrequencyPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestão de Frequência</h1>
          <p className="text-gray-600">Controle e acompanhe a frequência dos alunos</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="lancamento" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="lancamento" className="text-sm font-medium">
              Lançamento de Frequência
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="text-sm font-medium">
              Relatórios de Frequência
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lancamento" className="mt-0">
            <AttendancePage />
          </TabsContent>
          
          <TabsContent value="relatorios" className="mt-0">
            <ReportsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FrequencyPage;
