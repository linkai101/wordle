import React from 'react';
import Head from 'next/head';

import toast, { Toaster } from 'react-hot-toast';

import answers from '../data/answers.json'; // List of answers in date order
import wordlist from '../data/wordlist.json'; // List of all possible 5-letter words (not including answers)

// TODO: add keys for maps

export default function Home() {
  const [gameStatus, setGameStatus] = React.useState("IN_PROGRESS"); // IN_PROGRESS, WIN, FAIL

  const [board, setBoard] = React.useState<string[]>(['','','','','','']);
  const [evals, setEvals] = React.useState<string[][]>([null,null,null,null,null,null]);
  const [rowIndex, setRowIndex] = React.useState<number>(0);
  const [solution, setSolution] = React.useState<string>(answers[Math.floor(Math.random()*answers.length)]); // TODO

  const [guess, setGuess] = React.useState<string>('');

  function typeLetter(letter:string) {
    if (guess.length >= 5) return; // letter cap at 5
    setGuess(guess => guess + letter);
  }

  function deleteLetter() {
    setGuess(guess => guess.slice(0,-1));
  }

  function enterGuess() {
    if (guess.length < 5) return toast("Not enough letters");
    if (!wordlist.includes(guess) && !answers.includes(guess)) return toast("Not in word list");

    setGuess('');
    setBoard(board => {
      board[rowIndex] = guess;
      return board;
    });
    setRowIndex(rowIndex => rowIndex+1);
    evalGuess();
  }

  function getLetterStatus(letter:string) { // update guesses on the keyboard
    let joinedBoard = board.join('').split('');
    let joinedEvals = evals.flat(1).filter(n => n);

    if (!joinedBoard.includes(letter))
      return null; // not guessed

    if (joinedEvals.filter((a,i) => a === 'correct' && letter === joinedBoard[i]).length > 0)
      return 'correct';

    if (solution.includes(letter))
      return 'present';

    return 'absent';
  }

  function evalGuess() { // update evals at rowIndex
    setEvals(evals => {
      evals[rowIndex] = board[rowIndex].split('').map((letter,i) => {
        if (letter === solution.charAt(i))
          return 'correct';
        if (solution.includes(letter))
          return 'present';
        return 'absent';
      });
      return evals;
    });

    if (guess === solution) return endGame('WIN');
    if (rowIndex >= 5) return endGame('FAIL');
  }

  function endGame(status:string) { // status: WIN, FAIL
    // TODO

    switch (status) {
      case "WIN":
        toast.success("WIN");
        break;
      case "FAIL":
        toast(solution, { duration: Infinity });
        break;
    }
  }

  return <>
    <Head>
      <title>Wordle Archive</title>
      <meta name="description" content="by @linkai101 on github" />
    </Head>

    <Toaster/> {/* for toasts */}

    <div className="flex flex-col h-screen">
      {/* NAVBAR */}
      <nav className="h-14 flex items-center justify-center top-0 p-2 bg-white border-b-2 border-zinc-200">
        <h1 className="text-3xl font-bold">Wordle Archive</h1>
      </nav>

      {/* GRID */}
      <main className="container max-w-lg grow p-4">
        <div className="flex flex-col gap-2 h-full justify-center items-center">
          {board.map((board,i) =>
            <div className="grid grid-cols-5 gap-2">
              {i === rowIndex ? // guess row
              <>
                {guess.substr(0,5).split('').map((letter,j) =>
                  <div
                    className="flex items-center justify-center text-3xl font-bold h-16 w-16 select-none border-2 border-zinc-500"
                  >
                    {letter.toUpperCase()}
                  </div>
                )}
                {[...Array(Math.max(0,5-guess.length))].map(a =>
                  <div className="border-2 border-zinc-300 h-16 w-16"></div>
                )}
              </>
              : board ? // previous row
                board.split('').map((letter,j) =>
                  <div
                    className={`flex items-center justify-center text-3xl font-bold h-16 w-16 select-none text-white
                      ${!evals[i] ? 'text-black border-2 border-zinc-500'
                        : evals[i][j] === 'correct' ? 'bg-emerald-400'
                        : evals[i][j] === 'present' ? 'bg-amber-300'
                        : 'bg-zinc-500'
                      }`}
                  >
                    {letter.toUpperCase()}
                  </div>
                )
              : // blank row
                [...Array(5)].map(a =>
                  <div className="border-2 border-zinc-300 h-16 w-16"></div>
                )
              }
            </div>
          )}
        </div>
      </main>

      {/* KEYBOARD */}
      <footer className="container max-w-lg px-4 py-2 flex flex-col gap-2">
        <div className="flex h-16 md:h-14 gap-1">
          {['q','w','e','r','t','y','u','i','o','p'].map(letter => {
            let letterStatus = getLetterStatus(letter);
            return <button
              className={`flex-1 rounded-md text-sm font-bold select-none
              ${
                letterStatus === 'correct' ? 'bg-emerald-400 text-white'
                : letterStatus === 'present' ? 'bg-amber-300 text-white'
                : letterStatus === 'absent' ? 'bg-zinc-500 text-white'
                : 'bg-zinc-300'
              }
              `}
              onClick={() => typeLetter(letter)}
              key={letter}
            >
              {letter.toUpperCase()}
            </button>
          })}
        </div>
        
        <div className="flex h-16 md:h-14 gap-1 px-2 md:px-6">
          {['a','s','d','f','g','h','j','k','l'].map(letter => {
            let letterStatus = getLetterStatus(letter);
            return <button
              className={`flex-1 rounded-md text-sm font-bold select-none
              ${
                letterStatus === 'correct' ? 'bg-emerald-400 text-white'
                : letterStatus === 'present' ? 'bg-amber-300 text-white'
                : letterStatus === 'absent' ? 'bg-zinc-500 text-white'
                : 'bg-zinc-300'
              }
              `}
              onClick={() => typeLetter(letter)}
              key={letter}
            >
              {letter.toUpperCase()}
            </button>
          })}
        </div>
        
        <div className="flex h-16 md:h-14 gap-1">
          <button
            className="w-12 sm:w-16 flex-none rounded-md bg-zinc-300 text-sm font-bold select-none"
            onClick={enterGuess}
          >
            ENTER
          </button>
          {['z','x','c','v','b','n','m'].map(letter => {
            let letterStatus = getLetterStatus(letter);
            return <button
              className={`flex-1 rounded-md text-sm font-bold select-none
              ${
                letterStatus === 'correct' ? 'bg-emerald-400 text-white'
                : letterStatus === 'present' ? 'bg-amber-300 text-white'
                : letterStatus === 'absent' ? 'bg-zinc-500 text-white'
                : 'bg-zinc-300'
              }
              `}
              onClick={() => typeLetter(letter)}
              key={letter}
            >
              {letter.toUpperCase()}
            </button>
          })}
          <button
            className="w-12 sm:w-16 flex-none rounded-md bg-zinc-300 text-sm font-bold select-none"
            onClick={deleteLetter}
          >
            DELETE
          </button>
        </div>
      </footer>
    </div>
  </>;
}
