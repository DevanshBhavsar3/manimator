import { Send } from "lucide-react";
import { Button } from "./Button";

interface PromptAreaProps {
  loading: boolean;
  promptRef: React.RefObject<string>;
  onSubmit: () => void;
}

export function PromptArea({ loading, promptRef, onSubmit }: PromptAreaProps) {
  return (
    <div className="relative w-full h-full">
      <textarea
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="px-4 py-2 rounded-xl bg-neutral-700 border border-neutral-500 w-full h-full outline-none resize-none text-neutral-100 text-lg"
        placeholder={"What do you want to animate??"}
        onChange={(e) => {
          promptRef.current = e.target.value;
        }}
        disabled={loading}
      />
      <Button
        onClick={onSubmit}
        variant="primary"
        disabled={loading}
        className="absolute right-3 bottom-2 rounded-xl p-2"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-neutral-300 border-t-black rounded-full animate-spin" />
        ) : (
          <Send size={24} className="text-black" />
        )}
      </Button>
    </div>
  );
}
