// src/pages/Frequencia.tsx - Corrigido para usar professores_materias
import { JSX, useEffect, useState } from 'react';
import React from 'react';
import AppLayout from '../components/AppLayout';
import {
  Container, Row, Col, Form, Button, Spinner, Toast, ToastContainer,
  Card,
  Modal,
} from 'react-bootstrap';
import {
  collection, getDocs, query, where,
  writeBatch, doc, getDoc
} from 'firebase/firestore';
import { CalendarIcon, Check, CheckSquare, Eye, Info, Plus, Save, Undo, User, UserCheck, UserX, X } from "lucide-react";
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCheck, FaUsers, FaUserTimes } from 'react-icons/fa';

//Data
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { ptBR } from "date-fns/locale";
import { registerLocale } from "react-datepicker";

// 👇 força o tipo como 'any' para evitar conflito
registerLocale("pt-BR", ptBR as any);



interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
}
interface Turma {
  id: string;
  nome: string;
}
interface Materia {
  id: string;
  nome: string;
}
interface Vinculo {
  professorId: string;
  materiaId: string;
  turmaId: string;
}

export default function Frequencia(): JSX.Element {
  const { userData } = useAuth()!;
  const isAdmin = userData?.tipo === 'administradores';

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const [turmaId, setTurmaId] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [dataAula, setDataAula] = useState('');

  const [attendance, setAttendance] = useState<Record<string, boolean | null>>({});
  const [history, setHistory] = useState<Record<string, boolean | null>[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string; variant: 'success' | 'danger' | 'warning' }>({ show: false, message: '', variant: 'success' });

  const [showJustModal, setShowJustModal] = useState(false);
  const [alunoJustId, setAlunoJustId] = useState<string | null>(null);
  const [justificativas, setJustificativas] = useState<Record<string, string>>({});
  const [justificativaTexto, setJustificativaTexto] = useState('');

  useEffect(() => {
    async function fetchData() {
      let turmaDocs = [];
      let materiaIds: string[] = [];
      let materiasList: Materia[] = [];

      if (isAdmin) {
        const turmaSnap = await getDocs(collection(db, 'turmas'));
        turmaDocs = turmaSnap.docs;

        const snap = await getDocs(collection(db, 'materias'));
        materiasList = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        materiaIds = materiasList.map(m => m.id);
      } else {
        if (!userData) return;
        const vincSnap = await getDocs(query(collection(db, 'professores_materias'), where('professorId', '==', userData.uid)));
        const vincList = vincSnap.docs.map(d => d.data() as Vinculo);
        setVinculos(vincList);

        const turmaIds = [...new Set(vincList.map(v => v.turmaId))];
        turmaDocs = await Promise.all(turmaIds.map(async id => await getDoc(doc(db, 'turmas', id))));

        materiaIds = [...new Set(vincList.map(v => v.materiaId))];
        const materiasSnap = await Promise.all(materiaIds.map(async id => {
          const ref = await getDoc(doc(db, 'materias', id));
          return { id: ref.id, nome: ref.data()?.nome || 'Desconhecida' };
        }));
        materiasList = materiasSnap;
      }

      setTurmas(
        turmaDocs
          .map(d => ({ id: d.id, nome: d.data()?.nome || '-' }))
          .sort((a, b) => a.nome.localeCompare(b.nome))
      );
      setMaterias(materiasList);
    }
    fetchData();
  }, [userData]);

  useEffect(() => {
    if (turmaId && materiaId) {
      setTimeout(() => {
        document.getElementById('data-aula')?.focus();
      }, 0);
    }
  }, [turmaId, materiaId]);

  useEffect(() => {
    async function fetchAlunos() {
      if (!turmaId || !materiaId || !dataAula) {
        setAlunos([]);
        setAttendance({});
        return;
      }
      setLoading(true);
      try {
        const alunosSnap = await getDocs(query(collection(db, 'alunos'), where('turmaId', '==', turmaId)));
        const listaAlunos: Aluno[] = alunosSnap.docs
          .map(d => ({ id: d.id, ...(d.data() as any) }))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        setAlunos(listaAlunos);

        const freqSnap = await getDocs(
          query(collection(db, 'frequencias'),
            where('turmaId', '==', turmaId),
            where('materiaId', '==', materiaId),
            where('data', '==', dataAula))
        );
        const presMap: Record<string, boolean | null> = {};
        freqSnap.docs.forEach(d => {
          const ddata = d.data() as any;
          presMap[ddata.alunoId] = ddata.presenca;
        });
        const initial: Record<string, boolean | null> = {};
        listaAlunos.forEach(a => {
          // Se houver registro anterior, usa ele. Caso contrário, marca como presente
          initial[a.id] = presMap[a.id] !== undefined ? presMap[a.id] : true;
        });
        setAttendance(initial);

        const justificativasMap: Record<string, string> = {};
        freqSnap.docs.forEach(d => {
          const ddata = d.data() as any;
          if (ddata.observacao) {
            justificativasMap[ddata.alunoId] = ddata.observacao;
          }
        });
        setJustificativas(justificativasMap);

      } catch (err) {
        console.error('Erro ao buscar dados de frequência:', err);
      }
      setLoading(false);
    }
    fetchAlunos();
  }, [turmaId, materiaId, dataAula]);

  const atualizarAttendance = (novoAttendance: Record<string, boolean | null>) => {
    setHistory(prev => [...prev, attendance]); // salva estado atual no histórico
    setAttendance(novoAttendance);
  };

  const marcarPresenca = (alunoId: string, presente: boolean | null) => {
    const novos = { ...attendance, [alunoId]: presente };
    atualizarAttendance(novos);
  };

  const marcarTodosComoPresente = () => {
    const novos = Object.fromEntries(alunos.map(a => [a.id, true]));
    atualizarAttendance(novos);
  };

  const marcarTodosComoAusente = () => {
    const novos = Object.fromEntries(alunos.map(a => [a.id, false]));
    atualizarAttendance(novos);
  };

  const desfazerAlteracao = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev; // nada para desfazer

      const ultimoEstado = prev[prev.length - 1];
      setAttendance(ultimoEstado);

      return prev.slice(0, -1);
    });
  };


  const handleSalvar = async () => {
    if (!turmaId || !materiaId || !dataAula || !alunos.length || Object.keys(attendance).length === 0) return;
    setSaving(true);
    const batch = writeBatch(db);
    alunos.forEach(aluno => {
      const docId = `${turmaId}_${materiaId}_${dataAula}_${aluno.id}`;
      const ref = doc(db, 'frequencias', docId);
      const justificativa = justificativas[aluno.id];
      batch.set(ref, {
        turmaId,
        materiaId,
        data: dataAula,
        alunoId: aluno.id,
        presenca: justificativa ? false : attendance[aluno.id], // Se tem justificativa, salva como ausente
        professorId: userData?.uid || '',
        observacao: justificativa || ''
      });
    });
    try {
      await batch.commit();
      setToast({ show: true, message: 'Frequência salva com sucesso!', variant: 'success' });
    } catch (err) {
      console.error('Erro ao salvar frequência:', err);
      setToast({ show: true, message: 'Falha ao salvar frequência.', variant: 'danger' });
    }
    setSaving(false);
  };

  // Cards porcentagem
  const totalAlunos = alunos.length;
  const totalPresentes = Object.values(attendance).filter(v => v === true).length;
  const totalAusentes = Object.values(attendance).filter(v => v === false).length;

  const porcentagemPresentes = totalAlunos ? ((totalPresentes / totalAlunos) * 100).toFixed(0) : 0;
  const porcentagemAusentes = totalAlunos ? ((totalAusentes / totalAlunos) * 100).toFixed(0) : 0;


  // Filtrar alunos
  const [filtroAlunos, setFiltroAlunos] = useState<'todos' | 'presentes' | 'ausentes'>('todos');
  const [buscaNome, setBuscaNome] = useState('');
  const filtrarAlunos = (tipo: 'todos' | 'presentes' | 'ausentes') => {
    setFiltroAlunos(tipo);
  };
  const alunosFiltrados = alunos.filter(a => {
    // filtro presença
    if (filtroAlunos === 'presentes' && !attendance[a.id]) return false;
    if (filtroAlunos === 'ausentes' && attendance[a.id]) return false;

    // filtro busca nome (case insensitive)
    if (buscaNome.trim() === '') return true;
    return a.nome.toLowerCase().includes(buscaNome.toLowerCase());
  });

  // Tabs
  const [activeTab, setActiveTab] = useState<'lancamento-frequencia' | 'relatorios-frequencia'>('lancamento-frequencia');

  // Confirmação de presença
  const [showModal, setShowModal] = useState(false);

  // Data
  function formatDate(date: Date) {
    // Garante que a data seja local, sem fuso horário
    return date.toLocaleDateString('en-CA'); // yyyy-MM-dd
  }

  function handleDateChange(date: Date | null) {
    if (!date) {
      setDataAula("");
      return;
    }

    const selectedDateISO = formatDate(date);
    const hoje = new Date();
    const hojeISO = formatDate(hoje);

    if (selectedDateISO !== hojeISO) {
      alert("A data selecionada não é a data atual.");
    }

    setDataAula(selectedDateISO);
  }


  type CustomDateInputProps = {
    value?: string;
    onClick?: () => void;
  };
  const CustomDateInput = React.forwardRef<HTMLInputElement, CustomDateInputProps>(
    ({ value, onClick }, ref) => {
      return (
        <div
          onClick={onClick}
          ref={ref as React.Ref<HTMLDivElement>} // para evitar problemas com ref no wrapper
          className="position-relative"
          style={{ width: "100%" }}
        >
          <input
            type="text"
            value={value}
            readOnly
            className="form-control"
            placeholder="Selecione uma data"
            autoComplete="off"
            style={{ width: "100%", paddingRight: "2.5rem" }} // espaço para o ícone
          />
          <CalendarIcon
            size={18}
            className="position-absolute"
            style={{
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#6c757d",
            }}
          />
        </div>
      );
    }
  );

  function stringToLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // mês começa em 0
  }

  // Filtros relatorios
  function limparFiltros() {
    setTurmaId('');
    setMateriaId('');
    setDataAula('');
  }

  const [periodo, setPeriodo] = useState<[Date | null, Date | null]>([null, null]); // [dataInicio, dataFim]

  useEffect(() => {
    if (activeTab === 'lancamento-frequencia') {
      // Limpa dataAula se não for uma data válida
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dataAula)) {
        setDataAula('');
      }
    }
  }, [activeTab]);


  return (
    <AppLayout>
      <Container className="my-4">
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-bottom border-gray-200">
            <div className="container px-4">
              <div className="d-flex align-items-center justify-content-between py-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded bg-primary"
                    style={{ width: 48, height: 48 }}
                  >
                    <CheckSquare size={24} color="#fff" />
                  </div>
                  <div>
                    <h2 className="fs-3 fw-bold text-dark mb-0">Lançar Frequência</h2>
                    <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                      MobClassApp - Portal do Professor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Navigation Tabs */}
          <div className="bg-white border-bottom border-gray-200">
            <div className="container px-4">
              <div className="d-flex gap-3 py-3">
                <Button
                  variant={activeTab === 'lancamento-frequencia' ? 'primary' : 'outline-primary'}
                  className="d-flex align-items-center gap-2"
                  onClick={() => setActiveTab('lancamento-frequencia')}
                >
                  <Plus size={18} />
                  <span>Lançamento de Frequência</span>
                </Button>
                <Button
                  variant={activeTab === 'relatorios-frequencia' ? 'primary' : 'outline-primary'}
                  className="d-flex align-items-center gap-2"
                  onClick={() => setActiveTab('relatorios-frequencia')}
                >
                  <Eye size={18} />
                  <span>Relatórios de Frequência</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content*/}
          <div className="container py-4">
            {activeTab === 'lancamento-frequencia' ? (
              <Card className='shadow-sm p-3'>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Select
                      value={turmaId}
                      onChange={e => {
                        setTurmaId(e.target.value);
                        setMateriaId('');
                      }}
                    >
                      <option value="">Selecione a Turma</option>
                      {turmas.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={4}>
                    <Form.Select
                      value={materiaId}
                      onChange={e => setMateriaId(e.target.value)}
                      disabled={!turmaId}
                    >
                      <option value="">Selecione a Matéria</option>
                      {isAdmin
                        ? materias
                          .filter(m => m && m.nome)
                          .map(m => (
                            <option key={m.id} value={m.id}>
                              {m.nome}
                            </option>
                          ))
                        : vinculos
                          .filter(v => v.turmaId === turmaId)
                          .map(v => {
                            const materia = materias.find(m => m.id === v.materiaId);
                            return materia ? (
                              <option key={materia.id} value={materia.id}>
                                {materia.nome}
                              </option>
                            ) : null;
                          })}
                    </Form.Select>
                  </Col>

                  <Col md={4}>
                    <DatePicker
                      selected={dataAula ? stringToLocalDate(dataAula) : null}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      locale="pt-BR"
                      calendarClassName="custom-calendar-small"
                      customInput={<CustomDateInput />}
                      showPopperArrow={false}
                      autoComplete="off"
                      wrapperClassName="w-100"
                    />
                  </Col>
                </Row>
                <Row className="mb-2 justify-content-end">
                  <Col className="d-flex gap-3 justify-content-end" md={7}>
                    <Button
                      variant="success"
                      onClick={marcarTodosComoPresente}
                      className="d-flex align-items-center gap-2"
                    >
                      <UserCheck size={18} />
                      Todos Presentes
                    </Button>
                    <Button
                      variant="danger"
                      onClick={marcarTodosComoAusente}
                      className="d-flex align-items-center gap-2"
                    >
                      <UserX size={18} />
                      Todos Ausentes
                    </Button>
                    <Button
                      onClick={desfazerAlteracao}
                      disabled={history.length === 0}
                      className="d-flex align-items-center gap-2 text-secondary bg-transparent border-0 p-0"
                    >
                      <Undo size={18} />
                      Desfazer
                    </Button>
                  </Col>
                </Row>
              </Card>
            ) : (
              <Card className='shadow-sm p-3'>
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Select
                      value={turmaId}
                      onChange={e => {
                        setTurmaId(e.target.value);
                        setMateriaId('');
                      }}
                    >
                      <option value="">Selecione a Turma</option>
                      {turmas.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={3}>
                    <Form.Select
                      value={materiaId}
                      onChange={e => setMateriaId(e.target.value)}
                      disabled={!turmaId}
                    >
                      <option value="">Selecione a Matéria</option>
                      {materias.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={3}>
                    <Form.Select
                      value={dataAula}
                      onChange={e => setDataAula(e.target.value)}
                    >
                      <option value="">Selecione o Tipo de Período</option>
                      <option value="mes">Mês</option>
                      <option value="personalizado">Personalizado</option>
                    </Form.Select>
                  </Col>
                  {dataAula === 'mes' && (
                    <Col md={3}>
                      <Form.Select
                        value={dataAula}
                        onChange={e => setDataAula(e.target.value)}
                      >
                        <option value="">Selecione o Mês</option>
                        {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((mes, index) => (
                          <option key={index} value={mes}>
                            {mes}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  )}
                  {dataAula === 'personalizado' && (
                    <Col md={3}>
                      <DatePicker
                        selected={/^\d{4}-\d{2}-\d{2}$/.test(dataAula) ? stringToLocalDate(dataAula) : null}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        locale="pt-BR"
                        calendarClassName="custom-calendar-small"
                        customInput={<CustomDateInput />}
                        showPopperArrow={false}
                        autoComplete="off"
                        wrapperClassName="w-100"
                      />
                    </Col>
                  )}
                </Row>

                <Row className="mb-2 justify-content-end">
                  <Col className="d-flex gap-3 justify-content-end" md={7}>
                    <Button
                      variant="primary"
                      className="d-flex align-items-center gap-2"
                    >
                      Aplicar Filtros
                    </Button>
                    <Button
                      className="d-flex align-items-center gap-2 text-secondary bg-transparent border-0 p-0"
                      style={{ color: 'black' }}
                      onClick={limparFiltros}
                    >
                      Limpar Filtros
                    </Button>

                  </Col>
                </Row>
              </Card>
            )}
          </div>

          {activeTab === "lancamento-frequencia" && alunos.length > 0 && (
            <>
              <Row>
                <Col md={4}>
                  <Card className="shadow-sm p-3 text-center">
                    <div className="fs-4 text-success">
                      <FaUserCheck className="me-2" />
                      {totalPresentes}
                    </div>
                    <div className="fw-semibold fs-6">
                      <span className="text-success">Presentes</span>
                      <span className="text-muted"> ({porcentagemPresentes}%)</span>
                    </div>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="shadow-sm p-3 text-center">
                    <div className="fs-4 text-danger">
                      <FaUserTimes className="me-2" />
                      {totalAusentes}
                    </div>
                    <div className="fw-semibold fs-6">
                      <span className="text-danger">Ausentes</span>
                      <span className="text-muted"> ({porcentagemAusentes}%)</span>
                    </div>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="shadow-sm p-3 text-center">
                    <div className="fs-4 text-secondary">
                      <FaUsers className="me-2" />
                      {totalAlunos}
                    </div>
                    <div className="fw-semibold fs-6 text-secondary">Total de Alunos</div>
                  </Card>
                </Col>
              </Row>
              <Card className='shadow-sm p-3'>
                <Col md={12} className="d-flex justify-content-end gap-3">
                  <Form.Control
                    type="search"
                    placeholder="Buscar aluno..."
                    value={buscaNome}
                    onChange={e => setBuscaNome(e.target.value)}
                    autoComplete="off"
                  />
                  <Button
                    variant={filtroAlunos === "todos" ? "primary" : "outline-primary"}
                    onClick={() => filtrarAlunos('todos')}
                    className="d-flex align-items-center gap-2"
                  >
                    Todos
                  </Button>

                  <Button
                    variant={filtroAlunos === "presentes" ? "primary" : "outline-primary"}
                    onClick={() => filtrarAlunos('presentes')}
                    className="d-flex align-items-center gap-2"
                  >
                    Presentes
                  </Button>

                  <Button
                    variant={filtroAlunos === "ausentes" ? "primary" : "outline-primary"}
                    onClick={() => filtrarAlunos('ausentes')}
                    className="d-flex align-items-center gap-2"
                  >
                    Ausentes
                  </Button>

                </Col>
              </Card>
            </>
          )}

          {loading ? (
            <div className="d-flex justify-content-center align-items-center vh-50">
              <Spinner animation="border" />
            </div>
          ) : (
            activeTab === "lancamento-frequencia" && alunos.length > 0 && (
              <Card className="shadow-sm">
                <Card.Body>
                  <h3 className="mb-3 px-3">Lista de Alunos</h3>
                  <div className="d-flex flex-column gap-0">
                    {alunosFiltrados.map(a => (
                      <Card
                        key={a.id}
                        className="w-100 custom-card-frequencia mb-0"
                      >
                        <Card.Body className="d-flex justify-content-between align-items-center py-3 px-3">
                          <div className="d-flex align-items-center">
                            <div className="user-icon-circle-frequencia">
                              <User size={24} color="#fff" />
                            </div>
                            <span className="aluno-nome-frequencia">{a.nome}</span>
                          </div>
                          <div className="d-flex gap-2">

                            <Button
                              variant={attendance[a.id] ? "success" : "outline-success"}
                              size="lg"
                              className="btn-presenca-frequencia d-flex align-items-center gap-2"
                              onClick={() => {
                                marcarPresenca(a.id, true);
                                if (justificativas[a.id]) {
                                  setJustificativas(prev => {
                                    const novo = { ...prev };
                                    delete novo[a.id];
                                    return novo;
                                  });
                                  setToast({
                                    show: true,
                                    message: 'Justificativa removida!',
                                    variant: 'danger'
                                  });
                                }
                              }}
                            >
                              <Check size={20} />
                              Presente
                            </Button>

                            <Button
                              variant={attendance[a.id] === false && !justificativas[a.id] ? "danger" : "outline-danger"}
                              size="lg"
                              className="btn-presenca-frequencia d-flex align-items-center gap-2"
                              onClick={() => {
                                marcarPresenca(a.id, false);
                                if (justificativas[a.id]) {
                                  setJustificativas(prev => {
                                    const novo = { ...prev };
                                    delete novo[a.id];
                                    return novo;
                                  });
                                  setToast({
                                    show: true,
                                    message: 'Justificativa removida!',
                                    variant: 'danger'
                                  });
                                }
                              }}
                            >
                              <X size={20} />
                              Ausente
                            </Button>
                            <Button
                              variant={justificativas[a.id] ? "warning" : "outline-warning"}
                              size="lg"
                              className={`btn-presenca-frequencia d-flex align-items-center gap-2 justifyificada-button${justificativas[a.id] ? " selected" : ""}`}
                              onClick={() => {
                                setAlunoJustId(a.id);
                                setJustificativaTexto(justificativas[a.id] || '');
                                setShowJustModal(true);
                              }}
                            >
                              <Info size={20} />
                              Justificado
                            </Button>

                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )
          )
          }
          {(activeTab === "lancamento-frequencia" && alunos.length > 0 && (
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              disabled={
                saving ||
                loading ||
                !alunos.length ||
                Object.keys(attendance).length === 0
              }
              className="d-flex justify-content-center align-items-center mx-auto"
            >
              {saving ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <Save size={20} />
                  <span className="ms-2">Salvar Frequência</span>
                </>
              )}
            </Button>
          ))}


          {/* Modal Confirmacao */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Frequência</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Você marcou <strong>{totalPresentes}</strong> presentes e <strong>{totalAusentes}</strong> ausentes. Deseja confirmar?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowModal(false);
                  handleSalvar(); // aqui você chama sua função de salvar
                }}
              >
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal Justificativa */}
          <Modal show={showJustModal} onHide={() => setShowJustModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Justificativa de Ausência</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="justificativa">
                  <Form.Label>Motivo</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ex: Atestado médico"
                    value={justificativaTexto}
                    onChange={(e) => setJustificativaTexto(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowJustModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (alunoJustId) {
                    setJustificativas(prev => ({
                      ...prev,
                      [alunoJustId]: justificativaTexto
                    }));
                    // Marca como ausente ao salvar justificativa
                    marcarPresenca(alunoJustId, false);
                  }
                  setShowJustModal(false);
                }}
              >
                Salvar Justificativa
              </Button>
            </Modal.Footer>
          </Modal>

          <ToastContainer position="bottom-end" className="p-3">
            <Toast
              show={toast.show}
              bg={toast.variant}
              onClose={() => setToast(prev => ({ ...prev, show: false }))}
              delay={3000}
              autohide
            >
              <Toast.Body className="text-white">{toast.message}</Toast.Body>
            </Toast>
          </ToastContainer>
        </div>
      </Container>
    </AppLayout>
  );
}







