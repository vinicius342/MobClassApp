
export interface Communication {
  id: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  status: 'sent' | 'scheduled' | 'draft';
  message: string;
  readPercentage: number;
}
