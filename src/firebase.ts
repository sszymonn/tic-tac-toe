import {
  GoogleAuthProvider,
  connectAuthEmulator,
  signInWithPopup,
} from "firebase/auth";
import {
  Database,
  connectDatabaseEmulator,
  getDatabase,
  onValue,
  ref,
  set,
  get,
  update,
} from "firebase/database";

import { initializeApp } from "firebase/app";
import { Auth, User, getAuth, onAuthStateChanged } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GameStatus } from "./domain";

const firebaseConfig = {
  apiKey: "AIzaSyCbKfW-DdxsQoJ1MaLu4pe9B0PHVBOgd5c",
  authDomain: "tic-tac-toe-70579.firebaseapp.com",
  projectId: "tic-tac-toe-70579",
  storageBucket: "tic-tac-toe-70579.appspot.com",
  messagingSenderId: "746239722725",
  appId: "1:746239722725:web:1987b74c8f4e20d52cc00c",
  // databaseURL:
  //   "https://tic-tac-toe-70579-default-rtdb.europe-west1.firebasedatabase.app",
  databaseURL: "http://127.0.0.1:9000/?ns=tic-tac-toe-70579",
};

const provider = new GoogleAuthProvider();

export const useFirebase = () => {
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const [auth, setAuth] = useState<Auth>();
  const [user, setUser] = useState<User>();
  const [db, setDb] = useState<Database>();

  useEffect(() => {
    const _auth = getAuth(app);
    setAuth(getAuth(app));
    connectAuthEmulator(_auth, "http://127.0.0.1:9099");
  }, [app]);

  useEffect(() => {
    if (!auth) return;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
    });
  }, [auth]);

  useEffect(() => {
    if (!user) return;

    const db = getDatabase(app);
    if (location.hostname === "localhost") {
      // Point to the RTDB emulator running on localhost.
      connectDatabaseEmulator(db, "127.0.0.1", 9000);
    }
    setDb(db);
  }, [user]);

  return { auth, user, db };
};

export const signIn = async ({ auth }: { auth: Auth }) => {
  const result = await signInWithPopup(auth, provider);
  GoogleAuthProvider.credentialFromResult(result);
};

export const useGame = ({ db, user }: { db?: Database; user?: User }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>();
  const [gameId, setGameId] = useState<string>();
  const [gameMark, setGameMark] = useState<"X" | "O">();
  const [gameBoard, setGameBoard] = useState<(null | "X" | "O")[][]>();

  const joinGame = useCallback(
    async ({ db, user }: { db: Database; user: User }) => {
      if (!db || !user) return;
      await set(ref(db, "queue/" + user.uid), {
        uid: user.uid,
        status: "waiting",
        gameId: null,
      });
    },
    [db, user]
  );

  useEffect(() => {
    if (!user || !db) return;
    const queueRef = ref(db, "queue/" + user.uid);
    onValue(queueRef, (snapshot) => {
      const data = snapshot.val();
      setGameStatus(data?.status);
      if (data?.gameId) {
        setGameId(data?.gameId);
      }
    });
  }, [db, user]);

  useEffect(() => {
    if (!user || !db || !gameId) return;

    const gameRef = ref(db, "games/" + gameId);

    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.board) {
        setGameBoard(JSON.parse(data?.board));
      }
      setGameStatus(data?.status);
      setGameMark(data?.players.find((p: any) => p.uid === user.uid)?.mark);
    });

  }, [gameId, db, user]);

  const makeMove = useCallback(
    ({ rowIndex, colIndex }: { rowIndex: number; colIndex: number }) => {
      const gameRef = ref(db!, "games/" + gameId);

      const newBoard = [...gameBoard!];
      // @ts-expect-error
      newBoard[rowIndex][colIndex] = gameMark;
      update(gameRef, {
        board: JSON.stringify(newBoard),
      });
    },
    [gameBoard]
  );

  return { joinGame, gameStatus, gameMark, gameBoard, makeMove };
};
