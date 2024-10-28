export interface Task {
  id: string;
  content: string;
  timer: number | null;
}

export interface CompletedTask {
  id: string;
  content: string;
  completedAt: string;
  completedBy: string;
  reactions: {
    hearts: number;
    celebrations: number;
  };
}