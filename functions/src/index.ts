/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onValueCreated} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onValueCreated, onValueWritten } from "firebase-functions/v2/database";
import { setGlobalOptions } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger";

import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

import { randomUUID } from "crypto";
import { checkDraw, checkWinner } from "./game.utils";

const useEmulator = ["test", "development"].includes(process.env?.NODE_ENV ?? '');

if (useEmulator) {
  process.env["FIREBASE_DATABASE_EMULATOR_HOST"] = "127.0.0.1:9000";
}

const defaultApp = initializeApp({
  databaseURL: "http://127.0.0.1:9000/?ns=tic-tac-toe-70579",
});
const defaultDatabase = getDatabase(defaultApp);

if (useEmulator) {
  setGlobalOptions({ region: "us-central1" });
} else {
  setGlobalOptions({ region: "europe-west1" });
}

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

type Game = {
  createdAt: string;
  id: string;
  players: { uid: string; mark: "X" | "O" }[];
  board: (null | "X" | "O")[][];
  status: "playing" | "waiting" | "over";
};

export const joinGame = onValueCreated("/queue/{uid}", async (event) => {
  logger.info("User added to queue", { structuredData: true });
  const data: { uid: string; status: "waiting" | "playing" } = event.data.val();
  logger.info(data, { structuredData: true });

  const snapshot = await defaultDatabase.ref("/games").get();
  const _games = snapshot.val();
  logger.info(_games, { structuredData: true });

  const allGames: Game[] = Object.values(_games ?? {});

  const games = allGames.filter((game) => !["over", "playing"].includes(game.status));

  logger.info(games, { structuredData: true });

  const { uid } = data;

  const uuid = randomUUID();

  if (
    games.filter((game: any) => game.players.length === 1).length === 0
  ) {
    await defaultDatabase.ref("/games/" + uuid).set({
      id: uuid,
      createdAt: new Date().toISOString(),
      players: [{ uid, mark: "X" }],
      board: JSON.stringify([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]),
      status: "waiting",
    });

    await defaultDatabase.ref("/queue/" + uid).update({
      gameId: uuid,
    });
  } else {
    // join the game if there is one player

    const game: Game = games[0];
    const gameRef = defaultDatabase.ref(`/games/${game.id}`);
    await gameRef.update({
      ...game,
      players: [
        ...game.players,
        {
          uid,
          mark: "O",
        },
      ],
      status: "playing",
    });

    // todo wrap in transaction
    await defaultDatabase.ref(`/queue/${uid}`).ref.update({
      gameId: game.id,
      status: "playing",
    });

    await defaultDatabase.ref(`/queue/${game.players[0].uid}`).ref.update({
      gameId: game.id,
      status: "playing",
    });
  }
});

export const updateGame = onValueWritten("/games/{gameId}", async (event) => {
  logger.info("Game updated", { structuredData: true });
  const game = event.data.after.val();

  game.board = JSON.parse(game.board);

  logger.info(game, { structuredData: true });

  const winner = checkWinner(game.board);
  const draw = checkDraw(game.board);

  if (winner || draw) {
    await defaultDatabase.ref(`/games/${game.id}`).update({
      ...game,
      board: JSON.stringify(game.board),
      status: "over"
    });
  }
});
