import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { SubjectsTable } from "@/components/subjects/SubjectsTable";
import { NewSubjectDialog } from "@/components/subjects/NewSubjectDialog";
import { EditSubjectDialog } from "@/components/subjects/EditSubjectDialog";
import { DeleteSubjectDialog } from "@/components/subjects/DeleteSubjectDialog";
import { SubjectsFilters } from "@/components/subjects/SubjectsFilters";
import { useToast } from "@/hooks/use-toast";

export interface Subject {
  id: string;
  name: string;
  code: string;
  category?: string;
  area?: string;
  series?: string;
  createdAt: string;
}

const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Matemática",
    code: "MAT101",
    category: "Exatas",
    area: "Ciências Exatas",
    series: "1º Ano",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "História",
    code: "HIS201",
    category: "Humanas",
    area: "Ciências Humanas",
    series: "2º Ano",
    createdAt: "2024-01-16"
  },
  {
    id: "3",
    name: "Química",
    code: "QUI301",
    category: "Exatas",
    area: "Ciências da Natureza",
    series: "3º Ano",
    createdAt: "2024-01-17"
  },
  {
    id: "4",
    name: "Literatura",
    code: "LIT102",
    category: "Linguagens",
    area: "Linguagens e Códigos",
    series: "1º Ano",
    createdAt: "2024-01-18"
  },
  {
    id: "5",
    name: "Física",
    code: "FIS202",
    category: "Exatas",
    area: "Ciências da Natureza",
    series: "2º Ano",
    createdAt: "2024-01-19"
  }
];

export const SubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { toast } = useToast();

  // Filtrar matérias
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || subject.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Paginação
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubjects = filteredSubjects.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateSubject = (subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setSubjects(prev => [...prev, newSubject]);
    setIsNewDialogOpen(false);
    
    toast({
      title: "Sucesso!",
      description: "Matéria criada com sucesso.",
    });
  };

  const handleEditSubject = (subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    if (!editingSubject) return;
    
    setSubjects(prev => prev.map(subject => 
      subject.id === editingSubject.id 
        ? { ...subject, ...subjectData }
        : subject
    ));
    
    setEditingSubject(null);
    
    toast({
      title: "Sucesso!",
      description: "Matéria editada com sucesso.",
    });
  };

  const handleDeleteSubject = () => {
    if (!deletingSubject) return;
    
    setSubjects(prev => prev.filter(subject => subject.id !== deletingSubject.id));
    setDeletingSubject(null);
    
    toast({
      title: "Sucesso!",
      description: "Matéria excluída com sucesso.",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matérias</h1>
          <p className="text-gray-600">Gerencie as matérias do sistema</p>
        </div>
        <Button
          onClick={() => setIsNewDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Matéria
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Matérias</p>
                <p className="text-2xl font-bold">{subjects.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exatas</p>
                <p className="text-2xl font-bold">
                  {subjects.filter(s => s.category === "Exatas").length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Humanas</p>
                <p className="text-2xl font-bold">
                  {subjects.filter(s => s.category === "Humanas").length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Linguagens</p>
                <p className="text-2xl font-bold">
                  {subjects.filter(s => s.category === "Linguagens").length}
                </p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <div className="w-6 h-6 bg-orange-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome da matéria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <SubjectsFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onClearFilters={clearFilters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              Matérias ({filteredSubjects.length})
            </span>
            {(searchTerm || selectedCategory) && (
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SubjectsTable
            subjects={paginatedSubjects}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={setEditingSubject}
            onDelete={setDeletingSubject}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NewSubjectDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onSubmit={handleCreateSubject}
      />

      {editingSubject && (
        <EditSubjectDialog
          subject={editingSubject}
          open={!!editingSubject}
          onOpenChange={(open) => !open && setEditingSubject(null)}
          onSubmit={handleEditSubject}
        />
      )}

      {deletingSubject && (
        <DeleteSubjectDialog
          subject={deletingSubject}
          open={!!deletingSubject}
          onOpenChange={(open) => !open && setDeletingSubject(null)}
          onConfirm={handleDeleteSubject}
        />
      )}
    </div>
  );
};
