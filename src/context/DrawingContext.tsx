
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DrawingElement, DrawingTool, Point, User, ChatMessage } from "@/types/drawing";
import { toast } from "sonner";

type DrawingContextType = {
  elements: DrawingElement[];
  setElements: React.Dispatch<React.SetStateAction<DrawingElement[]>>;
  currentTool: DrawingTool;
  setCurrentTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  isDrawing: boolean;
  setIsDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  currentElement: DrawingElement | null;
  setCurrentElement: React.Dispatch<React.SetStateAction<DrawingElement | null>>;
  selectedElement: DrawingElement | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<DrawingElement | null>>;
  users: User[];
  currentUser: User | null;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  joinRoom: (roomId: string, username: string) => void;
  clearCanvas: () => void;
  startDrawing: (x: number, y: number) => void;
  draw: (x: number, y: number) => void;
  stopDrawing: () => void;
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const useDrawing = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
};

export const DrawingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentTool, setCurrentTool] = useState<DrawingTool>("select");
  const [currentColor, setCurrentColor] = useState<string>("#333333");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<DrawingElement | null>(null);
  
  // Mock users for now - in a real app, this would come from a backend
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);
  const generateColor = () => {
    const colors = ["#9b87f5", "#7E69AB", "#6E59A5", "#FEC6A1", "#E5DEFF", "#D3E4FD"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedElement(null);
    toast("Canvas cleared");
  }, []);

  const startDrawing = useCallback((x: number, y: number) => {
    if (currentTool === "select") return;

    const id = generateId();
    let newElement: DrawingElement;

    switch (currentTool) {
      case "pen":
        newElement = {
          id,
          type: "pen",
          points: [{ x, y }],
          color: currentColor,
          width: 2,
        };
        break;
      case "rectangle":
      case "circle":
      case "arrow":
        newElement = {
          id,
          type: currentTool,
          x1: x,
          y1: y,
          x2: x,
          y2: y,
          color: currentColor,
          width: 2,
        };
        break;
      case "text":
        newElement = {
          id,
          type: "text",
          x1: x,
          y1: y,
          text: "",
          color: currentColor,
          fontSize: 16,
        };
        break;
      default:
        return;
    }

    setCurrentElement(newElement);
    setIsDrawing(true);
  }, [currentColor, currentTool]);

  const draw = useCallback((x: number, y: number) => {
    if (!isDrawing || !currentElement) return;

    const updatedElement = { ...currentElement };

    switch (currentElement.type) {
      case "pen":
        updatedElement.points = [...(updatedElement.points || []), { x, y }];
        break;
      case "rectangle":
      case "circle":
      case "arrow":
      case "text":
        updatedElement.x2 = x;
        updatedElement.y2 = y;
        break;
    }

    setCurrentElement(updatedElement);
  }, [currentElement, isDrawing]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !currentElement) return;

    setElements(prev => [...prev, currentElement]);
    setCurrentElement(null);
    setIsDrawing(false);

    // In a real app, we would sync with other users here
    if (currentElement.type === "text") {
      const text = prompt("Enter text:");
      if (text) {
        setElements(prev => 
          prev.map(el => 
            el.id === currentElement.id 
              ? { ...el, text } 
              : el
          )
        );
      } else {
        setElements(prev => prev.filter(el => el.id !== currentElement.id));
      }
    }
  }, [currentElement, isDrawing]);

  const joinRoom = useCallback((roomId: string, username: string) => {
    // In a real app, this would make an API call
    const newUser: User = {
      id: generateId(),
      name: username,
      color: generateColor(),
    };
    
    setCurrentUser(newUser);
    setUsers(prev => [...prev, newUser]);
    setRoomId(roomId);
    
    // Add a system message
    const systemMessage: ChatMessage = {
      id: generateId(),
      userId: "system",
      userName: "System",
      text: `${username} joined the room`,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, systemMessage]);
    toast(`Joined room: ${roomId}`);
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!currentUser || !text.trim()) return;
    
    const newMessage: ChatMessage = {
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // In a real app, we would send this to the backend here
  }, [currentUser]);

  const value = {
    elements,
    setElements,
    currentTool,
    setCurrentTool,
    currentColor,
    setCurrentColor,
    isDrawing,
    setIsDrawing,
    currentElement,
    setCurrentElement,
    selectedElement,
    setSelectedElement,
    users,
    currentUser,
    messages,
    sendMessage,
    joinRoom,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing,
  };

  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};
