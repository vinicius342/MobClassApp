// src/pages/Notas.tsx - Atualizado com turmas via professores_materias
import { act, JSX, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import {
  Container, Row, Col, Button, Form, Table, Spinner, Toast, ToastContainer,
  InputGroup, FormControl, Tabs, Tab,
  Card
} from 'react-bootstrap';
import {
  collection, getDocs, addDoc, updateDoc, doc, Timestamp,
  query, where, getDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import Paginacao from '../components/Paginacao';
import { Eye, Plus, Save, Check } from 'lucide-react';

interface Turma { id: string; nome: string; }
interface Aluno { uid: string; nome: string; turmaId: string; }
interface Materia { id: string; nome: string; turmaId: string; }
interface Nota {
  id: string; turmaId: string; materiaId: string; bimestre: string;
  notaParcial: number; notaGlobal: number; notaParticipacao: number;
  notaRecuperacao?: number;
  alunoUid: string; nomeAluno: string; dataLancamento: string;
}

export default function Notas(): JSX.Element {
  const { userData } = useAuth()!;
  const isAdmin = userData?.tipo === 'administradores';
  const userId = userData?.uid;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTurma, setFiltroTurma] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('');
  const [filtroBimestre, setFiltroBimestre] = useState('');
  const [notasEdit, setNotasEdit] = useState<Record<string, any>>({});
  const [busca, setBusca] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' as 'success' | 'danger' });
  const [saving, setSaving] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'lancamento' | 'resultados'>('lancamento');
  const [paginaAtualPorBimestre, setPaginaAtualPorBimestre] = useState<Record<string, number>>({ '1º': 1, '2º': 1, '3º': 1, '4º': 1 });
  const itensPorPagina = 10;
  const [alunosSalvos, setAlunosSalvos] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      let turmaDocs = [];
      let materiaIds: string[] = [];
      let materiasList: Materia[] = [];

      if (isAdmin) {
        const turmasSnap = await getDocs(collection(db, 'turmas'));
        turmaDocs = turmasSnap.docs;

        const snap = await getDocs(collection(db, 'materias'));
        materiasList = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        materiaIds = materiasList.map(m => m.id);
      } else {
        const vincSnap = await getDocs(query(collection(db, 'professores_materias'), where('professorId', '==', userId)));
        const vincList = vincSnap.docs.map(d => d.data());

        const turmaIds = [...new Set(vincList.map(v => v.turmaId))];
        turmaDocs = await Promise.all(turmaIds.map(async id => await getDoc(doc(db, 'turmas', id))));

        materiaIds = [...new Set(vincList.map(v => v.materiaId))];
        const materiasSnap = await Promise.all(
          materiaIds.map(async id => {
            const m = await getDoc(doc(db, 'materias', id));
            return { id: m.id, ...(m.data() as any) };
          })
        );
        materiasList = materiasSnap;
      }

      const alunosSnap = await getDocs(collection(db, 'alunos'));
      const alunosList = alunosSnap.docs.map(d => ({ uid: d.id, ...(d.data() as any) })) as Aluno[];

      const notasSnap = await getDocs(collection(db, 'notas'));
      const notasDocs = isAdmin ? notasSnap.docs : notasSnap.docs.filter(doc => materiaIds.includes(doc.data().materiaId));

      const notasList = notasDocs.map(docSnap => {
        const data = docSnap.data() as any;
        const alunoData = alunosList.find(a => a.uid === data.alunoUid);
        return {
          id: docSnap.id,
          turmaId: data.turmaId,
          materiaId: data.materiaId,
          bimestre: data.bimestre,
          notaParcial: data.notaParcial,
          notaGlobal: data.notaGlobal,
          notaParticipacao: data.notaParticipacao,
          notaRecuperacao: data.notaRecuperacao,
          alunoUid: data.alunoUid,
          nomeAluno: alunoData?.nome || 'Desconhecido',
          dataLancamento: data.dataLancamento?.toDate().toLocaleDateString('pt-BR') || '',
        };
      });

      setTurmas(
        turmaDocs
          .map(d => ({ id: d.id, nome: d.data()?.nome || '-' }))
          .sort((a, b) => a.nome.localeCompare(b.nome))
      );
      setAlunos(alunosList);
      setMaterias(materiasList);
      setNotas(notasList);
      setLoading(false);
    }
    fetchData();
  }, [userData]);

  useEffect(() => {
    if (!filtroTurma || !filtroMateria || !filtroBimestre) {
      setNotasEdit({});
      return;
    }
    const alunosFiltrados = alunos.filter(a => a.turmaId === filtroTurma).sort((a, b) => a.nome.localeCompare(b.nome));
    const newEdit: Record<string, any> = {};
    alunosFiltrados.forEach(a => {
      const existing = notas.find(n =>
        n.turmaId === filtroTurma &&
        n.materiaId === filtroMateria &&
        n.bimestre === filtroBimestre &&
        n.alunoUid === a.uid
      );
      newEdit[a.uid] = existing
        ? {
          id: existing.id,
          notaParcial: existing.notaParcial?.toString() ?? '',
          notaGlobal: existing.notaGlobal?.toString() ?? '',
          notaParticipacao: existing.notaParticipacao?.toString() ?? '',
          notaRecuperacao: existing.notaRecuperacao?.toString() ?? ''
        }
        : { notaParcial: '', notaGlobal: '', notaParticipacao: '', notaRecuperacao: '' };
    });
    setNotasEdit(newEdit);
  }, [filtroTurma, filtroMateria, filtroBimestre, notas, alunos]);

  const handleChange = (uid: string, field: string, value: string) => {
    setNotasEdit(prev => ({ ...prev, [uid]: { ...prev[uid], [field]: value } }));
  };

  const saveRecord = async (uid: string, data: any) => {
    const parseOrNull = (val: string) => val.trim() !== '' && !isNaN(Number(val)) ? parseFloat(val) : null;

    const payload = {
      turmaId: filtroTurma,
      alunoUid: uid,
      materiaId: filtroMateria,
      bimestre: filtroBimestre,
      notaParcial: parseOrNull(data.notaParcial),
      notaGlobal: parseOrNull(data.notaGlobal),
      notaParticipacao: parseOrNull(data.notaParticipacao),
      notaRecuperacao: parseOrNull(data.notaRecuperacao),
      dataLancamento: Timestamp.now(),
    };

    if (data.id) {
      await updateDoc(doc(db, 'notas', data.id), payload);
    } else {
      await addDoc(collection(db, 'notas'), payload);
    }
  };

  const handleSave = async (uid: string) => {
    if (!filtroTurma || !filtroMateria || !filtroBimestre) return;
    const data = notasEdit[uid];
    const hasAnyNota = [data.notaParcial, data.notaGlobal, data.notaParticipacao].some(val => val.trim() !== '');

    if (!hasAnyNota) {
      setToast({ show: true, message: 'Preencha ao menos um campo de nota', variant: 'danger' });
      return;
    }

    setSaving(true);
    try {
      await saveRecord(uid, data);
      setToast({ show: true, message: 'Nota salva com sucesso!', variant: 'success' });
      setAlunosSalvos(prev => [...prev, uid]);
      setTimeout(() => {
        setAlunosSalvos(prev => prev.filter(id => id !== uid));
      }, 2000); // O check some após 2 segundos (ajuste se quiser)
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Erro ao salvar nota', variant: 'danger' });
    }
    setSaving(false);
  };

  const handleSaveAll = async () => {
    if (!filtroTurma || !filtroMateria || !filtroBimestre) return;
    setSaving(true);
    try {
      for (const [uid, data] of Object.entries(notasEdit)) {
        const hasAnyNota = [data.notaParcial, data.notaGlobal, data.notaParticipacao]
          .some(val => typeof val === 'string' && val.trim() !== '');

        if (hasAnyNota) {
          await saveRecord(uid, data);
        }
      }
      setToast({ show: true, message: 'Notas salvas com sucesso!', variant: 'success' });
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: 'Erro ao salvar notas', variant: 'danger' });
    }
    setSaving(false);
  };

  const handlePaginaChange = (bimestre: string, novaPagina: number) => {
    setPaginaAtualPorBimestre(prev => ({ ...prev, [bimestre]: novaPagina }));
  };

  //Tabs
  const [activeTab, setActiveTab] = useState<'lancamento-notas' | 'visualizacao-resultados'>('lancamento-notas');

  function campoAlterado(uid: string, campo: string): boolean {
    const notaOriginal = notas.find(n =>
      n.turmaId === filtroTurma &&
      n.materiaId === filtroMateria &&
      n.bimestre === filtroBimestre &&
      n.alunoUid === uid
    );
    const valorOriginal = notaOriginal ? ((notaOriginal as Record<string, any>)[campo] ?? '').toString() : '';
    const valorEditado = notasEdit[uid]?.[campo] ?? '';
    return valorEditado !== valorOriginal && valorEditado !== '';
  }

  return (
    <AppLayout>
      <Container className="my-4">
        <div className="bg-white border-bottom border-gray-200 mb-4">
          <div className="container px-4 border-bottom">
            <div className="d-flex align-items-center justify-content-between py-4">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded bg-primary text-white fw-bold"
                  style={{ width: 48, height: 48, fontSize: 20 }}
                >
                  10
                </div>
                <div>
                  <h2 className="fs-3 fw-bold text-dark mb-0">Notas</h2>
                  <p className="text-muted mb-0" style={{ fontSize: 14 }}>
                    MobClassApp - Portal do Professor
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Navigation Tabs */}
          <div className="container px-4">
            <div className="d-flex gap-3 py-3">
              <Button
                variant={activeTab === 'lancamento-notas' ? 'primary' : 'outline-primary'}
                className="d-flex align-items-center gap-2"
                onClick={() => setActiveTab('lancamento-notas')}
              >
                <Plus size={18} className='nothing-in-mobile' />
                <span>Lançamento de Notas</span>
              </Button>
              <Button
                variant={activeTab === 'visualizacao-resultados' ? 'primary' : 'outline-primary'}
                className="d-flex align-items-center gap-2"
                onClick={() => setActiveTab('visualizacao-resultados')}
              >
                <Eye size={18} className='nothing-in-mobile' />
                <span>Visualização de Resultados</span>
              </Button>
            </div>
          </div>
        </div>

        {activeTab === 'lancamento-notas' && (
          <>
            <Card className='shadow-sm p-3'>
              <Row>
                <Col md={3}>
                  <Form.Select value={filtroTurma} onChange={e => setFiltroTurma(e.target.value)}>
                    <option value="">Selecione a Turma</option>
                    {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select value={filtroMateria} onChange={e => setFiltroMateria(e.target.value)}>
                    <option value="">Selecione a Matéria</option>
                    {materias.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select value={filtroBimestre} onChange={e => setFiltroBimestre(e.target.value)}>
                    <option value="">Bimestre</option>
                    <option value="1º">1º</option>
                    <option value="2º">2º</option>
                    <option value="3º">3º</option>
                    <option value="4º">4º</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <InputGroup>
                    <FormControl placeholder="Buscar aluno" value={busca} onChange={e => setBusca(e.target.value)} />
                  </InputGroup>
                </Col>
              </Row>
            </Card>

            {loading ? (
              <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : !filtroTurma || !filtroMateria || !filtroBimestre ? (
              <p className="text-muted">Selecione turma, matéria e bimestre para lançar notas.</p>
            ) : (
              <>
                <style>{`.table-responsive {overflow-x: visible !important;}`}</style>
                <Card className='shadow-sm p-3'>
                  <Table responsive hover>
                    <thead className="thead-sticky">
                      <tr style={{ textAlign: 'center' }}>
                        <th className='text-muted'>Aluno</th>
                        <th className='text-muted'>Parcial</th>
                        <th className='text-muted'>Global</th>
                        <th className='text-muted'>Participação</th>
                        <th className='text-muted'>Recuperação</th>
                        <th className='text-muted'>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(notasEdit)
                        .filter(([uid]) => alunos.find(a => a.uid === uid)?.nome.toLowerCase().includes(busca.toLowerCase()))
                        .map(([uid, nota]) => {
                          const aluno = alunos.find(a => a.uid === uid)!;
                          return (
                            <tr key={uid} className='align-middle'>
                              <td className='aluno-nome-frequencia ms-2' style={{ fontSize: '1rem', alignItems: 'center' }}>
                                {alunosSalvos.includes(uid) && (
                                  <Check size={18} color="#28a745" style={{ marginRight: 4 }} />
                                )}
                                {aluno.nome}
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={nota.notaParcial}
                                  onChange={e => handleChange(uid, 'notaParcial', e.target.value)}
                                  style={{ width: '80px' }}
                                  className={`mx-auto d-block${campoAlterado(uid, 'notaParcial') ? ' campo-alterado' : ''}`}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={nota.notaGlobal}
                                  onChange={e => handleChange(uid, 'notaGlobal', e.target.value)}
                                  style={{ width: '80px' }}
                                  className={`mx-auto d-block${campoAlterado(uid, 'notaGlobal') ? ' campo-alterado' : ''}`}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={nota.notaParticipacao}
                                  onChange={e => handleChange(uid, 'notaParticipacao', e.target.value)}
                                  style={{ width: '80px' }}
                                  className={`mx-auto d-block${campoAlterado(uid, 'notaParticipacao') ? ' campo-alterado' : ''}`}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  value={nota.notaRecuperacao}
                                  onChange={e => handleChange(uid, 'notaRecuperacao', e.target.value)}
                                  style={{ width: '80px' }}
                                  className={`mx-auto d-block${campoAlterado(uid, 'notaRecuperacao') ? ' campo-alterado' : ''}`}
                                />
                              </td>

                              <td>
                                <Button size="sm" onClick={() => handleSave(uid)}>
                                  <Save size={16} />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </Card>
                {(activeTab === "lancamento-notas" && alunos.length > 0 && (
                  <Button
                    variant="primary"
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="d-flex justify-content-center align-items-center mx-auto"
                  >
                    {saving ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <Save size={20} />
                        <span className="ms-2">Salvar Todas</span>
                      </>
                    )}
                  </Button>
                ))}

              </>
            )}
          </>
        )}

        {activeTab === 'visualizacao-resultados' && (
          <>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Select value={filtroTurma} onChange={e => setFiltroTurma(e.target.value)}>
                  <option value="">Filtrar Turma</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select value={filtroMateria} onChange={e => setFiltroMateria(e.target.value)}>
                  <option value="">Filtrar Matéria</option>
                  {materias.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                </Form.Select>
              </Col>
              <Col md={4}>
                <InputGroup>
                  <FormControl placeholder="Buscar aluno" value={busca} onChange={e => setBusca(e.target.value)} />
                </InputGroup>
              </Col>
            </Row>

            <Tabs defaultActiveKey="1º" className="mb-3">
              {['1º', '2º', '3º', '4º'].map(bimestre => {
                const resultadosFiltradosOriginal = notas
                  .filter(n =>
                    (!filtroTurma || n.turmaId === filtroTurma) &&
                    (!filtroMateria || n.materiaId === filtroMateria) &&
                    n.bimestre === bimestre &&
                    n.nomeAluno.toLowerCase().includes(busca.toLowerCase()) &&
                    (isAdmin || materias.some(m => m.id === n.materiaId))
                  );

                const resultadosMap = new Map<string, Nota>();
                resultadosFiltradosOriginal.forEach(nota => {
                  const chave = `${nota.alunoUid}-${nota.materiaId}`;
                  const existente = resultadosMap.get(chave);
                  const dataAtual = new Date(nota.dataLancamento.split('/').reverse().join('-')).getTime();
                  const dataExistente = existente ? new Date(existente.dataLancamento.split('/').reverse().join('-')).getTime() : 0;
                  if (!existente || dataAtual > dataExistente) {
                    resultadosMap.set(chave, nota);
                  }
                });

                const resultadosFiltrados = Array.from(resultadosMap.values()).sort((a, b) => a.nomeAluno.localeCompare(b.nomeAluno));

                const totalPaginas = Math.ceil(resultadosFiltrados.length / itensPorPagina);
                const paginaAtual = paginaAtualPorBimestre[bimestre] || 1;
                const dadosPaginados = resultadosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

                const calcularMediaFinal = (n: Nota) => {
                  const parcial = typeof n.notaParcial === 'number' ? n.notaParcial : 0;
                  const global = typeof n.notaGlobal === 'number' ? n.notaGlobal : 0;
                  const participacao = typeof n.notaParticipacao === 'number' ? n.notaParticipacao : 0;
                  const media = ((parcial + global) / 2) + participacao;
                  return Math.min(parseFloat(media.toFixed(1)), 10);
                };

                const mediasFinais = resultadosFiltrados.map(calcularMediaFinal);
                const totalAlunos = mediasFinais.length;
                const mediaTurma = totalAlunos ? (mediasFinais.reduce((a, b) => a + b, 0) / totalAlunos).toFixed(1) : '-';

                const faixa = (min: number, max: number) =>
                  mediasFinais.filter(m => m >= min && m <= max).length;

                const estatisticas = {
                  excelentes: faixa(9, 10),
                  boas: faixa(7, 8.9),
                  regulares: faixa(6, 9),
                  baixas: faixa(0, 5.9),
                };

                return (
                  <Tab eventKey={bimestre} title={`${bimestre} Bimestre`} key={bimestre}>
                    <Row className="mb-4">
                      <Col md={3}>
                        <Card className="text-center border-success shadow-sm">
                          <Card.Body>
                            <Card.Title className="text-success">Média Geral</Card.Title>
                            <h4 className="fw-bold">{mediaTurma}</h4>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center border-primary shadow-sm">
                          <Card.Body>
                            <Card.Title className="text-primary">Excelentes (≥ 9)</Card.Title>
                            <h4 className="fw-bold">{estatisticas.excelentes}</h4>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center border-warning shadow-sm">
                          <Card.Body>
                            <Card.Title className="text-warning">Regulares (6 a 9)</Card.Title>
                            <h4 className="fw-bold">{estatisticas.regulares}</h4>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={3}>
                        <Card className="text-center border-danger shadow-sm">
                          <Card.Body>
                            <Card.Title className="text-danger">Baixas (&lt; 6)</Card.Title>
                            <h4 className="fw-bold">{estatisticas.baixas}</h4>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Table bordered hover responsive className="bg-white shadow-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Aluno</th>
                          <th>Matéria</th>
                          <th>Parcial</th>
                          <th>Global</th>
                          <th>Participação</th>
                          <th>Recuperação</th>
                          <th>Média Final</th>
                          <th>Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dadosPaginados.map(nota => {
                          const mediaFinal = calcularMediaFinal(nota);
                          let cor = 'text-success';
                          if (mediaFinal < 6) cor = 'text-danger';
                          else if (mediaFinal < 7) cor = 'text-warning';
                          else if (mediaFinal < 9) cor = 'text-primary';

                          return (
                            <tr key={nota.id}>
                              <td>{nota.nomeAluno}</td>
                              <td>{materias.find(m => m.id === nota.materiaId)?.nome || '-'}</td>
                              <td>{nota.notaParcial ?? '-'}</td>
                              <td>{nota.notaGlobal ?? '-'}</td>
                              <td>{nota.notaParticipacao ?? '-'}</td>
                              <td>{nota.notaRecuperacao ?? '-'}</td>
                              <td className={`fw-bold ${cor}`}>{mediaFinal}</td>
                              <td><small>{nota.dataLancamento}</small></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>

                    <Paginacao
                      paginaAtual={paginaAtual}
                      totalPaginas={totalPaginas}
                      aoMudarPagina={(pagina) => handlePaginaChange(bimestre, pagina)}
                    />
                  </Tab>
                );
              })}
            </Tabs>
          </>
        )}

        <ToastContainer position="bottom-end" className="p-3">
          <Toast bg={toast.variant} show={toast.show} onClose={() => setToast(prev => ({ ...prev, show: false }))} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </AppLayout>
  );
}

























