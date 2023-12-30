const gameStatuses = ["playing", "waiting", "over"] as const;
export type GameMark = "O" | "X";
export type GameStatus = typeof gameStatuses[number];
export type MaybeGameMark = GameMark | null;
export type Board = MaybeGameMark[][];