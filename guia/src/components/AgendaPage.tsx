
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, Calendar, Plus } from "lucide-react";
import { AgendaTableView } from "@/components/AgendaTableView";
import { AgendaGridView } from "@/components/AgendaGridView";
import { NewClassDialog } from "@/components/NewClassDialog";

export interface Class {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  class: string;
  shift: "Manhã" | "Tarde" | "Noite";
  room?: string;
}

export const AgendaPage = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      day: "Segunda-feira",
      startTime: "08:00",
      endTime: "09:00",
      subject: "Matemática",
      teacher: "Prof. João Silva",
      class: "9º A",
      shift: "Manhã",
      room: "Sala 101"
    },
    {
      id: "2",
      day: "Segunda-feira",
      startTime: "09:00",
      endTime: "10:00",
      subject: "Português",
      teacher: "Prof. Maria Santos",
      class: "9º A",
      shift: "Manhã",
      room: "Sala 102"
    },
    {
      id: "3",
      day: "Terça-feira",
      startTime: "14:00",
      endTime: "15:00",
      subject: "História",
      teacher: "Prof. Carlos Lima",
      class: "8º B",
      shift: "Tarde",
      room: "Sala 103"
    },
    {
      id: "4",
      day: "Quarta-feira",
      startTime: "19:00",
      endTime: "20:00",
      subject: "Ciências",
      teacher: "Prof. Ana Costa",
      class: "EJA A",
      shift: "Noite",
      room: "Sala 104"
    }
  ]);

  const [isNewClassOpen, setIsNewClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const handleAddClass = (newClass: Omit<Class, "id">) => {
    const id = Date.now().toString();
    setClasses([...classes, { ...newClass, id }]);
  };

  const handleEditClass = (updatedClass: Class) => {
    setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const handleDuplicateClass = (classToClone: Class) => {
    const newId = Date.now().toString();
    const duplicatedClass = { ...classToClone, id: newId };
    setClasses([...classes, duplicatedClass]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Agenda Escolar</h1>
          <p className="text-gray-600 mt-1">Gerencie aulas, horários e turnos</p>
        </div>
        <Button 
          onClick={() => setIsNewClassOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Aula
        </Button>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Cadastro de Agendas
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Grade por Turnos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <AgendaTableView
            classes={classes}
            onEditClass={setEditingClass}
            onDeleteClass={handleDeleteClass}
            onDuplicateClass={handleDuplicateClass}
          />
        </TabsContent>

        <TabsContent value="grid" className="mt-6">
          <AgendaGridView
            classes={classes}
            onEditClass={setEditingClass}
            onAddClass={() => setIsNewClassOpen(true)}
          />
        </TabsContent>
      </Tabs>

      <NewClassDialog
        open={isNewClassOpen || !!editingClass}
        onOpenChange={(open) => {
          setIsNewClassOpen(open);
          if (!open) setEditingClass(null);
        }}
        onSave={editingClass ? handleEditClass : handleAddClass}
        editingClass={editingClass}
      />
    </div>
  );
};
