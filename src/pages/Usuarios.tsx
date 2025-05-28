// src/pages/Usuarios.tsx - Completo com coluna de ações modernizada (Dropdown)
import { useEffect, useState, ChangeEvent, JSX } from 'react';
import AppLayout from '../components/AppLayout';
import {
  Container, Row, Col, Button, Table, Tabs, Tab, Badge, Spinner,
  Modal, InputGroup, FormControl, Toast, ToastContainer, Dropdown
} from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import Paginacao from '../components/Paginacao';
import { db } from '../services/firebase';
import {
  collection, getDocs, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import UsuarioForm, { FormValues, Turma, AlunoOption } from '../components/UsuarioForm';

interface UsuarioBase { id: string; nome: string; email: string; status: 'Ativo' | 'Inativo'; }
interface Professor extends UsuarioBase { turmas: string[]; }
interface Aluno extends UsuarioBase { turmaId?: string; responsavelId?: string; }
interface Responsavel extends UsuarioBase { filhos?: string[]; }
interface Administrador extends UsuarioBase {}

export default function Usuarios(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'professores' | 'alunos' | 'responsaveis' | 'administradores'>('professores');
  const [search, setSearch] = useState('');
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunosOptions, setAlunosOptions] = useState<AlunoOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formDefaults, setFormDefaults] = useState<Partial<FormValues>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; variant: 'success' | 'danger' }>({
    show: false, message: '', variant: 'success'
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [pSnap, aSnap, rSnap, tSnap, admSnap] = await Promise.all([
        getDocs(collection(db, 'professores')),
        getDocs(collection(db, 'alunos')),
        getDocs(collection(db, 'responsaveis')),
        getDocs(collection(db, 'turmas')),
        getDocs(collection(db, 'administradores')),
      ]);
      const alunosList = aSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setProfessores(pSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      setAlunos(alunosList);
      setAlunosOptions(alunosList.map(a => ({ id: a.id, nome: a.nome })));
      setResponsaveis(rSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      setAdministradores(admSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      setTurmas(tSnap.docs.map(d => ({ id: d.id, nome: (d.data() as any).nome })));
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const filterList = <T extends UsuarioBase>(list: T[]) =>
    list.filter(u => (u.nome + u.email).toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.nome.localeCompare(b.nome));

  const handleExcluir = async (id: string) => {
    if (!window.confirm('Excluir este usuário?')) return;
    await deleteDoc(doc(db, activeTab, id));
    if (activeTab === 'professores') setProfessores(prev => prev.filter(u => u.id !== id));
    if (activeTab === 'alunos') setAlunos(prev => prev.filter(u => u.id !== id));
    if (activeTab === 'responsaveis') setResponsaveis(prev => prev.filter(u => u.id !== id));
    if (activeTab === 'administradores') setAdministradores(prev => prev.filter(u => u.id !== id));
    setToast({ show: true, message: 'Usuário excluído!', variant: 'success' });
  };

  const openEdit = (user: UsuarioBase & any) => {
    const defaults: Partial<FormValues> = {
      tipoUsuario: activeTab,
      nome: user.nome,
      email: user.email,
      ...(activeTab === 'alunos' && { turmaId: user.turmaId }),
      ...(activeTab === 'professores' && { turmas: user.turmas }),
      ...(activeTab === 'responsaveis' && { filhos: user.filhos }),
      ...(user.id && { id: user.id }),
    };
    setFormDefaults(defaults);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      const userData = {
        nome: data.nome,
        email: data.email,
        status: 'Ativo',
        ...(data.tipoUsuario === 'alunos' && { turmaId: data.turmaId }),
        ...(data.tipoUsuario === 'professores' && { turmas: data.turmas }),
        ...(data.tipoUsuario === 'responsaveis' && { filhos: data.filhos }),
      };

      if (formMode === 'edit') {
        const docRef = doc(db, data.tipoUsuario, (formDefaults as any).id);
        await updateDoc(docRef, userData);
      } else {
        const response = await fetch("https://us-central1-agenda-digital-e481b.cloudfunctions.net/api/criar-usuario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: data.nome,
            email: data.email,
            tipoUsuario: data.tipoUsuario,
            turmaId: data.turmaId,
            filhos: data.filhos,
            turmas: data.turmas,
          }),
        });

        if (!response.ok) throw new Error("Erro ao criar usuário");
      }

      setToast({ show: true, message: 'Usuário salvo com sucesso!', variant: 'success' });
      setShowForm(false);

      const snapshot = await getDocs(collection(db, data.tipoUsuario));
      const novosDados = snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      if (data.tipoUsuario === 'professores') setProfessores(novosDados);
      if (data.tipoUsuario === 'alunos') {
        setAlunos(novosDados);
        setAlunosOptions(novosDados.map(a => ({ id: a.id, nome: a.nome })));
      }
      if (data.tipoUsuario === 'responsaveis') setResponsaveis(novosDados);
      if (data.tipoUsuario === 'administradores') setAdministradores(novosDados);
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'Erro ao salvar usuário.', variant: 'danger' });
    }
  };

  function renderRows(): JSX.Element[] {
    const list = activeTab === 'professores'
      ? filterList(professores)
      : activeTab === 'alunos'
        ? filterList(alunos)
        : activeTab === 'responsaveis'
          ? filterList(responsaveis)
          : filterList(administradores);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = list.slice(startIndex, startIndex + itemsPerPage);

    return paginated.map(user => (
      <tr key={user.id}>
        <td>{user.nome}</td>
        <td>{user.email}</td>
        <td><Badge bg={user.status === 'Ativo' ? 'success' : 'secondary'}>{user.status}</Badge></td>
        <td>
          {activeTab === 'professores' && (user as Professor).turmas.map(id => turmas.find(t => t.id === id)?.nome || id).join(', ')}
          {activeTab === 'alunos' && turmas.find(t => t.id === (user as Aluno).turmaId)?.nome}
          {activeTab === 'responsaveis' && (user as Responsavel).filhos?.map(filhoId => alunos.find(a => a.id === filhoId)?.nome).join(', ')}
        </td>
        <td>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" size="sm">
              <i className="bi bi-three-dots-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => openEdit(user)}>
                <i className="bi bi-pencil me-2"></i> Editar
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleExcluir(user.id)}>
                <i className="bi bi-trash me-2"></i> Excluir
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    ));
  }

  return (
    <AppLayout>
      <Container className="my-4">
        <Row className="justify-content-between align-items-center mb-3">
          <Col><h3 className="text-primary">Usuários</h3></Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => { setFormMode('add'); setFormDefaults({ tipoUsuario: activeTab }); setShowForm(true); }}>
              <PlusCircle className="me-2" size={18} /> Novo Usuário
            </Button>
          </Col>
        </Row>

        <InputGroup className="mb-3">
          <FormControl placeholder="Pesquisar..." value={search} onChange={handleSearch} />
        </InputGroup>

        <Tabs activeKey={activeTab} onSelect={k => { setActiveTab(k as any); setCurrentPage(1); }} className="mb-3">
          <Tab eventKey="professores" title="Professores" />
          <Tab eventKey="alunos" title="Alunos" />
          <Tab eventKey="responsaveis" title="Responsáveis" />
          <Tab eventKey="administradores" title="Administradores" />
        </Tabs>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : (
          <>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>{activeTab === 'professores' ? 'Turmas' : activeTab === 'alunos' ? 'Turma' : activeTab === 'responsaveis' ? 'Filhos' : '-'}</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>{renderRows()}</tbody>
            </Table>
            <Paginacao
  paginaAtual={currentPage}
  totalPaginas={Math.ceil(filterList(
    activeTab === 'professores' ? professores :
    activeTab === 'alunos' ? alunos :
    activeTab === 'responsaveis' ? responsaveis :
    administradores
  ).length / itemsPerPage)}
  aoMudarPagina={setCurrentPage}
/>
          </>
        )}

        <Modal show={showForm} onHide={() => setShowForm(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>{formMode === 'add' ? 'Adicionar Usuário' : 'Editar Usuário'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UsuarioForm
              turmas={turmas}
              alunosExistentes={alunosOptions}
              defaultValues={formDefaults}
              formMode={formMode}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </Modal.Body>
        </Modal>

        <ToastContainer position="bottom-end" className="p-3">
          <Toast bg={toast.variant} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </AppLayout>
  );
}







