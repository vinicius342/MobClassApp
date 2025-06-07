
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { CommunicationFilters } from "@/components/communications/CommunicationFilters";
import { CommunicationCard } from "@/components/communications/CommunicationCard";
import { NewCommunicationDialog } from "@/components/communications/NewCommunicationDialog";
import { Communication } from "@/types/communication";

// Mock data
const mockCommunications: Communication[] = [
  {
    id: "1",
    subject: "Cartelas do Bingo",
    class: "6º Ano B",
    date: "30/05/2025",
    time: "13h51",
    status: "sent",
    message: "Prezados responsáveis, informamos que as cartelas do bingo beneficente da escola já estão disponíveis para retirada na secretaria. O evento acontecerá no próximo sábado às 19h no pátio da escola.",
    readPercentage: 85
  },
  {
    id: "2",
    subject: "Reunião de Pais",
    class: "5º Ano A",
    date: "28/05/2025",
    time: "10h30",
    status: "scheduled",
    message: "Convocamos todos os responsáveis para a reunião mensal que acontecerá na próxima quinta-feira às 19h. Será discutido o progresso dos alunos e atividades do próximo mês.",
    readPercentage: 0
  },
  {
    id: "3",
    subject: "Festa Junina",
    class: "Todas as turmas",
    date: "25/05/2025",
    time: "16h20",
    status: "draft",
    message: "A tradicional festa junina da escola está sendo organizada para o mês de junho. Precisamos da colaboração de todos os pais para tornar este evento especial.",
    readPercentage: 0
  }
];

export function CommunicationsPage() {
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCommunications, setFilteredCommunications] = useState<Communication[]>(mockCommunications);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value === "") {
      setFilteredCommunications(communications);
    } else {
      const filtered = communications.filter(comm =>
        comm.subject.toLowerCase().includes(value.toLowerCase()) ||
        comm.message.toLowerCase().includes(value.toLowerCase()) ||
        comm.class.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCommunications(filtered);
    }
  };

  const handleFilter = (filters: any) => {
    let filtered = communications;

    if (searchTerm) {
      filtered = filtered.filter(comm =>
        comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.class && filters.class !== "all") {
      filtered = filtered.filter(comm => comm.class === filters.class);
    }

    if (filters.subject && filters.subject !== "all") {
      filtered = filtered.filter(comm => comm.subject.includes(filters.subject));
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(comm => comm.status === filters.status);
    }

    setFilteredCommunications(filtered);
  };

  const handleDelete = (id: string) => {
    const updated = communications.filter(comm => comm.id !== id);
    setCommunications(updated);
    setFilteredCommunications(updated.filter(comm => 
      !searchTerm || 
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.class.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  };

  const handleCreateCommunication = (newComm: Omit<Communication, 'id'>) => {
    const communication: Communication = {
      ...newComm,
      id: Date.now().toString()
    };
    const updated = [communication, ...communications];
    setCommunications(updated);
    setFilteredCommunications(updated);
    setIsNewDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Comunicados</h1>
        <Button 
          onClick={() => setIsNewDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Comunicado
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por assunto, mensagem ou turma"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <CommunicationFilters onFilter={handleFilter} />

      {/* Communications List */}
      <div className="space-y-4">
        {filteredCommunications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum comunicado encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </div>
        ) : (
          filteredCommunications.map((communication) => (
            <CommunicationCard
              key={communication.id}
              communication={communication}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <NewCommunicationDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onCreateCommunication={handleCreateCommunication}
      />
    </div>
  );
}
