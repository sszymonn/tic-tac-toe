import transpose from "lodash.unzip";
import { Board, MaybeGameMark } from "./domain";

const isX = (mark: MaybeGameMark): mark is "X" => {
  return mark === "X";
};

const isO = (mark: MaybeGameMark): mark is "O" => {
  return mark === "O";
};

const isNotNull = (mark: MaybeGameMark): boolean => {
  return mark !== null;
};

const lineWins = (line: MaybeGameMark[]) => {
  if (line.every(isX)) return "X";
  if (line.every(isO)) return "O";
  return null;
};

const rowWins = (board: MaybeGameMark[][]) => {
  const winningLine = board.find(lineWins);
  return winningLine ? lineWins(winningLine) : null;
};

const toDiagonal = (row: MaybeGameMark[], index: number) => {
  return row[index];
};

export const checkWinner = (board: Board): MaybeGameMark => {
  // Check rows
  const anyRowWon = rowWins(board);

  if (anyRowWon) {
    return anyRowWon;
  }

  // Check columns
  const tBoard = transpose(board);
  const anyColumnWon = rowWins(tBoard);

  if (anyColumnWon) {
    return anyColumnWon;
  }

  // Check diagonals
  return !!lineWins(board.map(toDiagonal))
    ? lineWins(board.map(toDiagonal))
    : lineWins([...board].reverse().map(toDiagonal));
};

// should be used after checkWinner to be checkDraw
export const checkDraw = (board: Board): boolean => {
  const hasWinner = !!checkWinner(board);
  return hasWinner ? false : board.flat().every(isNotNull);
};