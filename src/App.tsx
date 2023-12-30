import { Box } from "@mui/material";
import "./App.css";
import { signIn, useFirebase, useGame } from "./firebase";
import Button from "@mui/material/Button";
import { GameBoard } from "./GameBoard";
import { ref, remove } from "firebase/database";

function App() {
  const { auth, user, db } = useFirebase();

  const { joinGame, gameStatus, gameBoard, gameMark, makeMove } = useGame({
    db,
    user,
  });

  const playAgain = async () => {
    if (!db || !user) return;
    await remove(ref(db, `/queue/${user.uid}`));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      Play Tic Tac Toe
      {!!gameMark &&
        gameBoard &&
        gameStatus != null &&
        gameStatus !== "waiting" && (
          <GameBoard
            gameStatus={gameStatus}
            gameMark={gameMark}
            gameBoard={gameBoard}
            makeMove={makeMove}
          />
        )}
      {!user && !!auth && (
        <Button
          onClick={async () => {
            await signIn({ auth });
          }}
          variant="contained"
        >
          Sign In
        </Button>
      )}
      {!!user && !!db && !gameStatus && (
        <Button
          onClick={async () => {
            await joinGame({ db, user });
          }}
          variant="contained"
        >
          Play now
        </Button>
      )}
      {!!user && !!db && gameStatus === "waiting" && (
        <Button disabled variant="contained">
          Waiting for another player...
        </Button>
      )}
      {!!user && !!db && gameStatus === "over" && (
        <Button onClick={playAgain} variant="contained">
          Play again!
        </Button>
      )}
    </Box>
  );
}

export default App;
