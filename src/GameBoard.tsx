import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";
import type { Board, GameMark, MaybeGameMark } from "./domain";
import { checkDraw, checkWinner } from "./game.utils";

type GameBoardProps = {
  gameMark: GameMark;
  gameBoard: Board;
  gameStatus: "playing" | "over";
  makeMove: ({
    rowIndex,
    colIndex,
  }: {
    rowIndex: number;
    colIndex: number;
  }) => void;
};

export const GameBoard: FC<GameBoardProps> = ({
  gameBoard,
  makeMove,
  gameMark,
  gameStatus,
}) => {
  const [turnActive, setTurnActive] = useState<boolean>(true);

  useEffect(() => {
    console.log("gameStatus", gameStatus);
    if (gameStatus === "over") {
      setTurnActive(false);
    } else {
      setTurnActive(true);
    }
  }, [gameStatus, gameMark]);

  const handleSelect =
    ({ rowIndex, colIndex }: { rowIndex: number; colIndex: number }) =>
    () => {
      if (gameStatus !== "playing") {
        return;
      }
      if (!turnActive) {
        return;
      }
      if (gameBoard[rowIndex][colIndex] !== null) {
        return;
      }

      makeMove({ rowIndex, colIndex });
    };

  const winner = checkWinner(gameBoard);
  const draw = checkDraw(gameBoard);

  if ((winner === gameMark || draw) && turnActive) {
    console.log("turnActive", turnActive);
    setTurnActive(false);
  }

  return (
    <>
      {draw && <Box>Draw!</Box>}
      {winner === gameMark && <Box>Winner!</Box>}
      <Box
        sx={{ gridTemplateColumns: "1fr 1fr 1fr", display: "grid", gap: "8px" }}
      >
        {gameBoard.map((row: MaybeGameMark[], rowIndex) =>
          row.map((col: GameMark | null, colIndex) => {
            return (
              <Box
                key={`${rowIndex}-${colIndex}`}
                onClick={handleSelect({ rowIndex, colIndex })}
                sx={{
                  p: "1rem",
                  backgroundColor: "gray",
                  cursor: (turnActive && gameStatus !== 'over') ? "pointer" : "not-allowed",
                  width: "1.5rem",
                  height: "1.5rem",
                }}
              >
                {col}
              </Box>
            );
          })
        )}
      </Box>
    </>
  );
};
