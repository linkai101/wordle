import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeyboardProps {
  evals: {
    [key: string]: "correct" | "present" | "absent";
  };
  disabled: boolean;
  typeLetter: (letter: string) => void;
  deleteLetter: () => void;
  submitGuess: () => void;
}

export function Keyboard({ evals, disabled, typeLetter, deleteLetter, submitGuess }: KeyboardProps) {
  return (
    <div className="flex flex-col gap-2 px-2 pb-2 xl:px-6 xl:pb-4">
      <div className="flex h-14 gap-1">
        {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((letter) => (
          <KeyboardKey
            key={letter}
            letter={letter}
            evaluation={evals[letter]}
            disabled={disabled}
            typeLetter={typeLetter}
          />
        ))}
      </div>

      <div className="flex h-14 gap-1 px-2 xl:px-8">
        {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((letter) => (
          <KeyboardKey
            key={letter}
            letter={letter}
            evaluation={evals[letter]}
            disabled={disabled}
            typeLetter={typeLetter}
          />
        ))}
      </div>

      <div className="flex h-14 gap-1 xl:px-2">
        <KeyboardEnterKey disabled={disabled} submitGuess={submitGuess} />

        {["z", "x", "c", "v", "b", "n", "m"].map((letter) => (
          <KeyboardKey
            key={letter}
            letter={letter}
            evaluation={evals[letter]}
            disabled={disabled}
            typeLetter={typeLetter}
          />
        ))}

        <KeyboardDeleteKey disabled={disabled} deleteLetter={deleteLetter} />
      </div>
    </div>
  );
}

function KeyboardKey({
  letter,
  evaluation,
  disabled = false,
  typeLetter,
}: {
  letter: string;
  evaluation?: "correct" | "present" | "absent";
  disabled?: boolean;
  typeLetter: (letter: string) => void;
}) {
  const handleClick = () => {
    if (disabled) return;
    typeLetter(letter);
  };

  return (
    <Button
      key={letter}
      variant="outline"
      className={cn("h-full flex-1 p-0 text-base font-bold", {
        "bg-correct dark:bg-correct text-correct-foreground dark:text-correct-foreground hover:bg-correct/90 hover:text-correct-foreground dark:hover:bg-correct/90 dark:hover:text-correct-foreground":
          evaluation === "correct",
        "bg-present dark:bg-present text-present-foreground dark:text-present-foreground hover:bg-present/90 hover:text-present-foreground dark:hover:bg-present/90 dark:hover:text-present-foreground":
          evaluation === "present",
        "bg-absent dark:bg-absent text-absent-foreground dark:text-absent-foreground hover:bg-absent/90 hover:text-absent-foreground dark:hover:bg-absent/90 dark:hover:text-absent-foreground":
          evaluation === "absent",
      })}
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()} // Prevent default focus behavior on click
      disabled={disabled}
      aria-disabled={disabled}
    >
      {letter.toUpperCase()}
    </Button>
  );
}

function KeyboardEnterKey({
  disabled = false,
  submitGuess,
}: {
  disabled?: boolean;
  submitGuess: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    submitGuess();
  };
  return (
    <Button
      variant="outline"
      className="h-full flex-1 px-2 text-xs font-bold xl:text-sm"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={handleClick}
    >
      {"ENTER"}
    </Button>
  );
}

function KeyboardDeleteKey({
  disabled = false,
  deleteLetter,
}: {
  disabled?: boolean;
  deleteLetter: () => void;
}) {
  const handleClick = () => {
    if (disabled) return;
    deleteLetter();
  };

  return (
    <Button
      variant="outline"
      size="icon-lg"
      className="h-full flex-1 gap-0 px-2 text-base"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={handleClick}
    >
      <Delete className="size-5" />
    </Button>
  );
}
