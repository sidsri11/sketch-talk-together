
import React from "react";
import { useDrawing } from "@/context/DrawingContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Square, 
  Circle, 
  ArrowRight, 
  Text, 
  Pencil, 
  MousePointer, 
  Trash2 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const colorOptions = [
  { color: "#333333", name: "Black" },
  { color: "#9b87f5", name: "Purple" },
  { color: "#7E69AB", name: "Dark Purple" },
  { color: "#6E59A5", name: "Deeper Purple" },
  { color: "#e91e63", name: "Pink" },
  { color: "#2196f3", name: "Blue" },
  { color: "#4caf50", name: "Green" },
  { color: "#ff9800", name: "Orange" },
];

const Toolbar: React.FC = () => {
  const { 
    currentTool, 
    setCurrentTool, 
    currentColor, 
    setCurrentColor,
    clearCanvas 
  } = useDrawing();

  return (
    <div className="flex flex-col p-2 bg-background border-r gap-6">
      <TooltipProvider>
        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "tool-button",
                  currentTool === "select" && "active"
                )}
                onClick={() => setCurrentTool("select")}
              >
                <MousePointer className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Select (S)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "tool-button",
                  currentTool === "pen" && "active"
                )}
                onClick={() => setCurrentTool("pen")}
              >
                <Pencil className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Draw (D)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "tool-button",
                  currentTool === "rectangle" && "active"
                )}
                onClick={() => setCurrentTool("rectangle")}
              >
                <Square className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Rectangle (R)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "tool-button",
                  currentTool === "circle" && "active"
                )}
                onClick={() => setCurrentTool("circle")}
              >
                <Circle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Circle (C)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "tool-button",
                  currentTool === "arrow" && "active"
                )}
                onClick={() => setCurrentTool("arrow")}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Arrow (A)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "tool-button",
                  currentTool === "text" && "active"
                )}
                onClick={() => setCurrentTool("text")}
              >
                <Text className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Text (T)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="border-t pt-2">
          <div className="grid grid-cols-2 gap-1">
            {colorOptions.map((option) => (
              <Tooltip key={option.color}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "w-6 h-6 rounded-full border border-gray-300",
                      currentColor === option.color && "ring-2 ring-primary"
                    )}
                    style={{ backgroundColor: option.color }}
                    onClick={() => setCurrentColor(option.color)}
                  />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{option.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="border-t pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="tool-button text-destructive hover:text-destructive"
                onClick={clearCanvas}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;
