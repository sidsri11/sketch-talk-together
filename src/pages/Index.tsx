
import { DrawingProvider } from "@/context/DrawingContext";
import DrawingBoard from "@/components/DrawingBoard";

const Index = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-3">
        <h1 className="text-xl font-bold text-primary">Sketch Talk</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <DrawingProvider>
          <DrawingBoard />
        </DrawingProvider>
      </main>
    </div>
  );
};

export default Index;
