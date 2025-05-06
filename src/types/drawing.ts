
export type Point = {
  x: number;
  y: number;
};

export type DrawingTool = "select" | "pen" | "rectangle" | "circle" | "arrow" | "text";

export type DrawingElement = {
  id: string;
  type: "pen" | "rectangle" | "circle" | "arrow" | "text";
  points?: Point[];
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  text?: string;
  color: string;
  width?: number;
  fontSize?: number;
  roomId?: string;
  userId?: string;
};

export type User = {
  id: string;
  name: string;
  color: string;
};

export type ChatMessage = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
};

export type Room = {
  id: string;
  name: string;
  users: User[];
  messages: ChatMessage[];
  elements: DrawingElement[];
};
