
import { useState } from "react";
import FrequencyReportsFilters from "./FrequencyReportsFilters";
import FrequencyReportsActions from "./FrequencyReportsActions";
import FrequencyReportsCharts from "./FrequencyReportsCharts";
import FrequencyReportsTable from "./FrequencyReportsTable";
import StudentDetailsModal from "./StudentDetailsModal";

interface Student {
  id: string;
  name: string;
  photo?: string;
  presences: number;
  absences: number;
  frequency: number;
  status: "ok" | "attention" | "critical";
}

const ReportsPage = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [periodType, setPeriodType] = useState("bimester");
  const [selectedBimester, setSelectedBimester] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock data
  const students: Student[] = [
    { id: "1", name: "Ana Silva", presences: 18, absences: 2, frequency: 90, status: "ok" },
    { id: "2", name: "Bruno Santos", presences: 16, absences: 4, frequency: 80, status: "attention" },
    { id: "3", name: "Carla Oliveira", presences: 12, absences: 8, frequency: 60, status: "critical" },
    { id: "4", name: "Daniel Costa", presences: 19, absences: 1, frequency: 95, status: "ok" },
    { id: "5", name: "Elena Rodrigues", presences: 15, absences: 5, frequency: 75, status: "attention" },
  ];

  const handleApplyFilters = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleClearFilters = () => {
    setSelectedClass("");
    setSelectedSubject("");
    setPeriodType("bimester");
    setSelectedBimester("");
    setSelectedMonth("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleExportPDF = () => {
    console.log("Exportando para PDF...");
  };

  const handleExportExcel = () => {
    console.log("Exportando para Excel...");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <FrequencyReportsFilters
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        periodType={periodType}
        setPeriodType={setPeriodType}
        selectedBimester={selectedBimester}
        setSelectedBimester={setSelectedBimester}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <FrequencyReportsActions
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
      />

      <FrequencyReportsCharts students={students} />

      <FrequencyReportsTable
        students={students}
        isLoading={isLoading}
        onStudentClick={handleStudentClick}
      />

      <StudentDetailsModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ReportsPage;
