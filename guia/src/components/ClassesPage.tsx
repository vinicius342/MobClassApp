
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type UserType = 'Professores' | 'Alunos' | 'Responsáveis' | 'Administradores';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  class: string;
  type: UserType;
}

const mockUsers: User[] = [
  { id: 1, name: "Ana Laura Martins Dantas", email: "analauradantas2024@icloud.com", status: "Ativo", class: "7º Ano A", type: "Alunos" },
  { id: 2, name: "Ana Sophya Moreira Oliveira", email: "anam06889@gmail.com", status: "Ativo", class: "7º Ano A", type: "Alunos" },
  { id: 3, name: "Analice Souza Silva", email: "anasilva2021.13@gmail.com", status: "Ativo", class: "8º Ano A", type: "Alunos" },
  { id: 4, name: "Antony David Farias do Nascimento", email: "Lucilenefarias1385@gmail.com", status: "Ativo", class: "8º Ano A", type: "Alunos" },
  { id: 5, name: "Arthur da Silva chaves", email: "vivianesousza25@gmail.com", status: "Ativo", class: "8º Ano A", type: "Alunos" },
  { id: 6, name: "Arthur da Silva Dantas", email: "asaluminio07@gmail.com", status: "Ativo", class: "8º Ano A", type: "Alunos" },
  { id: 7, name: "Bruno La Fayette Magarotte de Azevedo Lima", email: "brunolafayette22@gmail.com", status: "Ativo", class: "7º Ano A", type: "Alunos" },
  { id: 8, name: "Carlos Eduardo Alves Oliveira", email: "tatyaneholivier@hotmail.com", status: "Ativo", class: "8º Ano A", type: "Alunos" },
  { id: 9, name: "Carlos Eduardo Costa Falcão", email: "carloseduardocostafalcao@gmail.com", status: "Ativo", class: "7º Ano A", type: "Alunos" },
  { id: 10, name: "Catarina Abreu Galvão", email: "catarinaabregualvao1@gmail.com", status: "Ativo", class: "7º Ano A", type: "Alunos" },
];

const userTypes: UserType[] = ['Professores', 'Alunos', 'Responsáveis', 'Administradores'];

export function ClassesPage() {
  const [selectedType, setSelectedType] = useState<UserType>('Alunos');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter(user => 
    user.type === selectedType &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const usersPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Usuários</h1>
            <p className="text-sm text-gray-500">Olá, Administrador Essencia (administradores)</p>
          </div>
          <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <p>Funcionalidade de novo usuário será implementada em breve.</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {userTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Nome</TableHead>
                <TableHead className="font-semibold text-gray-900">E-mail</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Turma</TableHead>
                <TableHead className="font-semibold text-gray-900">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-blue-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'Ativo' ? 'default' : 'secondary'}
                      className={user.status === 'Ativo' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.class}</TableCell>
                  <TableCell>
                    <span className="text-gray-400">-</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
