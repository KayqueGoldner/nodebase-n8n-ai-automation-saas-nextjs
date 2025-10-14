import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const condition = true;

  return (
    <div
      className={cn(
        "text-lg text-red-500",
        condition && "text-yellow-500"
      )}
    >
      Hello World
      <Button>Click me</Button>
    </div>
  );
}
