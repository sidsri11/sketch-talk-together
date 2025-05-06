
import React, { useRef, useEffect } from "react";
import { useDrawing } from "@/context/DrawingContext";
import { DrawingElement, Point } from "@/types/drawing";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    elements,
    currentElement,
    currentTool,
    startDrawing,
    draw,
    stopDrawing,
  } = useDrawing();

  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    return ctx;
  };

  const redrawCanvas = () => {
    const ctx = getCanvasContext();
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw all elements
    [...elements, currentElement].filter(Boolean).forEach((element) => {
      if (!element) return;
      drawElement(ctx, element);
    });
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = element.width || 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (element.type) {
      case "pen":
        if (!element.points || element.points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(element.points[0].x, element.points[0].y);
        
        element.points.forEach((point: Point) => {
          ctx.lineTo(point.x, point.y);
        });
        
        ctx.stroke();
        break;
        
      case "rectangle":
        if (element.x1 === undefined || element.y1 === undefined || 
            element.x2 === undefined || element.y2 === undefined) return;
        
        const rectWidth = element.x2 - element.x1;
        const rectHeight = element.y2 - element.y1;
        
        ctx.beginPath();
        ctx.rect(element.x1, element.y1, rectWidth, rectHeight);
        ctx.stroke();
        break;
        
      case "circle":
        if (element.x1 === undefined || element.y1 === undefined || 
            element.x2 === undefined || element.y2 === undefined) return;
        
        const circleX = element.x1;
        const circleY = element.y1;
        const radius = Math.sqrt(
          Math.pow(element.x2 - element.x1, 2) + Math.pow(element.y2 - element.y1, 2)
        );
        
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
        
      case "arrow":
        if (element.x1 === undefined || element.y1 === undefined || 
            element.x2 === undefined || element.y2 === undefined) return;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(element.x1, element.y1);
        ctx.lineTo(element.x2, element.y2);
        ctx.stroke();
        
        // Draw arrow head
        const angle = Math.atan2(element.y2 - element.y1, element.x2 - element.x1);
        const headLength = 15;
        
        ctx.beginPath();
        ctx.moveTo(element.x2, element.y2);
        ctx.lineTo(
          element.x2 - headLength * Math.cos(angle - Math.PI / 6),
          element.y2 - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(element.x2, element.y2);
        ctx.lineTo(
          element.x2 - headLength * Math.cos(angle + Math.PI / 6),
          element.y2 - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
        
      case "text":
        if (element.x1 === undefined || element.y1 === undefined || !element.text) return;
        
        ctx.font = `${element.fontSize || 16}px Arial`;
        ctx.fillText(element.text, element.x1, element.y1);
        break;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to match its container and make it full screen
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      // Set to full container size
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    redrawCanvas();
  }, [elements, currentElement]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    startDrawing(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    draw(x, y);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  const handleMouseLeave = () => {
    stopDrawing();
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ 
        cursor: currentTool === "select" ? "default" : "crosshair", 
        color: "black",
        width: "100%",
        height: "100%"
      }}
    />
  );
};

export default Canvas;
