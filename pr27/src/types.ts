export interface TaskSimulation {
  processingMs?: number;
  failForAttempts?: number;
}

export interface TaskRequestBody {
  type: string;
  payload: Record<string, unknown>;
  simulation?: TaskSimulation;
}

export interface TaskMessage {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  simulation?: TaskSimulation;
  attempt: number;
  createdAt: string;
}
