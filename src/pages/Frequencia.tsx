// src/pages/Frequencia.tsx - Corrigido para usar professores_materias
import { JSX, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import {
  Container, Row, Col, Form, Button, Table, Spinner, Toast, ToastContainer,
} from 'react-bootstrap';
import {
  collection, getDocs, query, where,
  writeBatch, doc, getDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

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

  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; message: string; variant: 'success' | 'danger' }>({ show: false, message: '', variant: 'success' });

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
        const presMap: Record<string, boolean> = {};
        freqSnap.docs.forEach(d => {
          const ddata = d.data() as any;
          presMap[ddata.alunoId] = ddata.presenca;
        });
        const initial: Record<string, boolean> = {};
        listaAlunos.forEach(a => { initial[a.id] = !!presMap[a.id]; });
        setAttendance(initial);
      } catch (err) {
        console.error('Erro ao buscar dados de frequência:', err);
      }
      setLoading(false);
    }
    fetchAlunos();
  }, [turmaId, materiaId, dataAula]);

  const marcarPresenca = (alunoId: string, presente: boolean) => {
    setAttendance(prev => ({ ...prev, [alunoId]: presente }));
  };

  const marcarTodosComoPresente = () => {
    const novos = Object.fromEntries(alunos.map(a => [a.id, true]));
    setAttendance(novos);
  };

  const marcarTodosComoAusente = () => {
    const novos = Object.fromEntries(alunos.map(a => [a.id, false]));
    setAttendance(novos);
  };

  const handleSalvar = async () => {
    if (!turmaId || !materiaId || !dataAula || !alunos.length || Object.keys(attendance).length === 0) return;
    setSaving(true);
    const batch = writeBatch(db);
    alunos.forEach(aluno => {
      const docId = `${turmaId}_${materiaId}_${dataAula}_${aluno.id}`;
      const ref = doc(db, 'frequencias', docId);
      batch.set(ref, {
        turmaId,
        materiaId,
        data: dataAula,
        alunoId: aluno.id,
        presenca: attendance[aluno.id],
        professorId: userData?.uid || ''
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

  return (
    <AppLayout>
      <Container className="my-4">
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={4}>
            <h3 className="text-primary">Lançar Frequência</h3>
          </Col>
          <Col xs={12} md={8} className="d-flex gap-2">
            <Form.Select value={turmaId} onChange={e => {
              setTurmaId(e.target.value);
              setMateriaId('');
            }}>
              <option value="">Selecione a Turma</option>
              {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </Form.Select>
            <Form.Select value={materiaId} onChange={e => setMateriaId(e.target.value)} disabled={!turmaId}>
              <option value="">Selecione a Matéria</option>
              {vinculos
                .filter(v => v.turmaId === turmaId)
                .map(v => {
                  const materia = materias.find(m => m.id === v.materiaId);
                  return materia ? (
                    <option key={materia.id} value={materia.id}>{materia.nome}</option>
                  ) : null;
                })}
            </Form.Select>
            <Form.Control id="data-aula" type="date" value={dataAula} onChange={e => setDataAula(e.target.value)} />
            <Button variant="primary" onClick={handleSalvar} disabled={saving || loading || !alunos.length || Object.keys(attendance).length === 0}>
              {saving ? <Spinner animation="border" size="sm" /> : 'Salvar'}
            </Button>
          </Col>
        </Row>

        {alunos.length > 0 && (
          <>
            <Row className="mb-2">
              <Col className="d-flex gap-2">
                <Button variant="success" size="sm" onClick={marcarTodosComoPresente}>Todos Presentes</Button>
                <Button variant="danger" size="sm" onClick={marcarTodosComoAusente}>Todos Ausentes</Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <p>Presentes: {Object.values(attendance).filter(v => v).length} | Ausentes: {Object.values(attendance).filter(v => !v).length}</p>
              </Col>
            </Row>
          </>
        )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center vh-50">
            <Spinner animation="border" />
          </div>
        ) : (
          alunos.length > 0 && (
            <Table responsive bordered hover>
              <thead className="table-light">
                <tr>
                  <th>Aluno</th>
                  <th className="text-center">Presença</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map(a => (
                  <tr
                    key={a.id}
                    style={{ backgroundColor: attendance[a.id] ? '#d4edda' : '#f8d7da' }}
                  >
                    <td>{a.nome}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant={attendance[a.id] ? 'success' : 'outline-success'}
                          size="sm"
                          onClick={() => marcarPresenca(a.id, true)}
                        >
                          ✓ Presente
                        </Button>
                        <Button
                          variant={!attendance[a.id] ? 'danger' : 'outline-danger'}
                          size="sm"
                          onClick={() => marcarPresenca(a.id, false)}
                        >
                          ✕ Ausente
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )
        )}

        <ToastContainer position="bottom-end" className="p-3">
          <Toast show={toast.show} bg={toast.variant} onClose={() => setToast(prev => ({ ...prev, show: false }))} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </AppLayout>
  );
}








