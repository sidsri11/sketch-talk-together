
import React, { useState, useEffect } from "react";
import { useDrawing } from "@/context/DrawingContext";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import Chat from "./Chat";
import RoomJoinModal from "./RoomJoinModal";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const DrawingBoard: React.FC = () => {
  const { currentUser } = useDrawing();
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [layout, setLayout] = useState({
    toolbarSize: 60,  // Width in pixels
    canvasSize: 70,   // Percentage
    chatSize: 30,     // Percentage
  });

  useEffect(() => {
    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process shortcuts if we're not in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { setCurrentTool, clearCanvas } = useDrawing();
      
      switch (e.key.toLowerCase()) {
        case "s":
          setCurrentTool("select");
          break;
        case "d":
          setCurrentTool("pen");
          break;
        case "r":
          setCurrentTool("rectangle");
          break;
        case "c":
          setCurrentTool("circle");
          break;
        case "a":
          setCurrentTool("arrow");
          break;
        case "t":
          setCurrentTool("text");
          break;
        case "escape":
          // Clear selection or cancel operation
          break;
        case "delete":
        case "backspace":
          // Delete selected element
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel 
          defaultSize={layout.toolbarSize} 
          minSize={50} 
          maxSize={100}
          className="flex"
        >
          <Toolbar />
        </ResizablePanel>
        
        <ResizablePanel defaultSize={layout.canvasSize} minSize={30} className="flex h-full overflow-hidden">
          {currentUser ? (
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-4 left-4 z-10 bg-background bg-opacity-50 backdrop-blur-sm p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {currentUser.name}
                  </span>
                </div>
              </div>
              <div className="canvas-container w-full h-full overflow-hidden">
                <Canvas />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Welcome to Sketch Talk</h2>
                <p className="text-muted-foreground mb-6">Join a room to start drawing and chatting with others</p>
                <Button onClick={() => setShowJoinModal(true)}>
                  Join a Room
                </Button>
              </div>
            </div>
          )}
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={layout.chatSize} minSize={20}>
          <Chat />
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <RoomJoinModal
        open={showJoinModal && !currentUser}
        onOpenChange={setShowJoinModal}
      />
    </>
  );
};

export default DrawingBoard;
