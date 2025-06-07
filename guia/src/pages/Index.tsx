
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { TasksPage } from "@/components/TasksPage";
import FrequencyPage from "@/components/FrequencyPage";
import { ClassesPage } from "@/components/ClassesPage";
import GradesPage from "@/components/GradesPage";
import { AgendaPage } from "@/components/AgendaPage";
import { CommunicationsPage } from "@/components/CommunicationsPage";
import { SubjectsPage } from "@/components/SubjectsPage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Tarefas":
        return <TasksPage />;
      case "Agenda":
        return <AgendaPage />;
      case "Frequência":
        return <FrequencyPage />;
      case "Notas":
        return <GradesPage />;
      case "Comunicados":
        return <CommunicationsPage />;
      case "Matérias":
        return <SubjectsPage />;
      case "Turmas":
        return <ClassesPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <main className="flex-1 bg-gray-50">{renderContent()}</main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
