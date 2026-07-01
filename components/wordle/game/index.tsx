"use client";

import { useEffect, useState } from "react";
import { isValidWord, evaluateGuess } from "@/lib/wordle";
import { toast } from "sonner";

import { Keyboard } from "./keyboard";
import { GameBoard } from "./game-board";

export function Game({ solution, header }: { solution: string; header: React.ReactNode }) {
  const [gameStatus, setGameStatus] = useState<"in_progress" | "win" | "fail">("in_progress");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessEvals, setGuessEvals] = useState<("correct" | "present" | "absent")[][]>([]);
  const [keyboardEvals, setKeyboardEvals] = useState<{
    [key: string]: "correct" | "present" | "absent";
  }>({});

  const [currentGuess, setCurrentGuess] = useState<string>("");

  // KEYBOARD INPUT
  useEffect(() => {
    if (gameStatus !== "in_progress") return;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [currentGuess, gameStatus]);

  function handleKeyDown(e: KeyboardEvent) {
    let key = e.key;

    if (key === "Backspace") {
      // Backspace current guess
      deleteLetter();
    }
  }

  // Key press for letter input to prevent commands (e.g. CTRL+R) from being triggered
  function handleKeyPress(e: KeyboardEvent) {
    let key = e.key;

    if (key === "Enter") {
      return submitGuess();
    }

    if (/[a-zA-Z]/.test(key) && key.length === 1) {
      return typeLetter(e.key);
    }
  }

  // GAME FUNCTIONS
  function typeLetter(letter: string) {
    if (gameStatus !== "in_progress") return;

    setCurrentGuess((prev) => {
      if (prev.length >= 5) return prev;
      return prev + letter.toLowerCase();
    });
  }

  function deleteLetter() {
    if (gameStatus !== "in_progress") {
      return;
    }

    setCurrentGuess((prev) => prev.slice(0, -1));
  }

  function submitGuess() {
    if (gameStatus !== "in_progress") {
      return;
    }

    if (currentGuess.length !== 5) {
      // TODO: show error message
      toast("Not enough letters");
      return;
    }

    if (!isValidWord(currentGuess)) {
      // TODO: show error message
      toast("Not in word list");
      return;
    }

    // Evaluate the guess and update the game state
    const result = evaluateGuess(currentGuess, solution);
    setGuesses((prev) => [...prev, currentGuess]);
    setGuessEvals((prev) => [...prev, result]);
    setKeyboardEvals((prev) => {
      const newEvals = { ...prev };
      for (let i = 0; i < currentGuess.length; i++) {
        if (result[i] === "correct") {
          newEvals[currentGuess[i]] = "correct";
        } else if (result[i] === "present" && newEvals[currentGuess[i]] !== "correct") {
          newEvals[currentGuess[i]] = "present";
        } else if (
          result[i] === "absent" &&
          !["correct", "present"].includes(newEvals[currentGuess[i]])
        ) {
          newEvals[currentGuess[i]] = "absent";
        }
      }
      return newEvals;
    });

    // Clear the current guess
    setCurrentGuess("");
  }

  // Check if the game is over
  useEffect(() => {
    const lastGuessEval = guessEvals[guessEvals.length - 1];
    if (lastGuessEval?.every((evaluation) => evaluation === "correct")) {
      // Win!
      toast.success(solution.toUpperCase(), { duration: Infinity });
      setGameStatus("win");
    } else if (guesses.length >= 6) {
      // Lose :(
      toast.error(solution.toUpperCase(), { duration: Infinity });
      setGameStatus("fail");
    }
  }, [guesses, guessEvals]);

  return (
    <div className="flex h-full flex-col">
      {/* HEADER */}
      {header}

      {/* GAME BOARD */}
      <main className="flex flex-1 justify-center overflow-y-auto">
        <div className="h-fit py-8">
          <GameBoard guesses={guesses} evals={guessEvals} currentGuess={currentGuess} />
        </div>
      </main>

      {/* KEYBOARD */}
      <Keyboard
        evals={keyboardEvals}
        disabled={gameStatus !== "in_progress"}
        typeLetter={typeLetter}
        deleteLetter={deleteLetter}
        submitGuess={submitGuess}
      />
    </div>
  );
}

export default Game;
