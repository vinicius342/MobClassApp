
export interface StudentReport {
  id: string;
  name: string;
  partial: number;
  global: number;
  participation: number;
  recovery: number;
  average: number;
  entryDate: string;
}

export interface GradeReportsFilters {
  selectedClass: string;
  selectedSubject: string;
  selectedSemester: string;
  searchStudent: string;
  sortBy: string;
}
