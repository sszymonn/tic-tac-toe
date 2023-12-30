export type GameMark = "O" | "X";
export type MaybeGameMark = GameMark | null;
export type Board = MaybeGameMark[][];