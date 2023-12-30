import { describe, expect, test } from "vitest";

import { Board } from "./domain";
import { checkWinner } from "./game.utils";

describe("game.utils", () => {
  describe("checkWinner", () => {
    test("should return null if no winner", () => {
      // arrange
      expect.assertions(1);
      const input = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toBeNull();
    });

    test("should return null if no winner - variant draw", () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        ["X", "O", "X"],
        ["O", "X", "O"],
        ["O", "X", "O"],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toBeNull();
    });
    test('should return "X" if X wins - variant row', () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        ["X", "X", "X"],
        [null, null, null],
        [null, null, null],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toStrictEqual("X");
    });

    test('should return "X" if X wins - variant column', () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        ["X", null, null],
        ["X", null, null],
        ["X", null, null],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toStrictEqual("X");
    });

    test('should return "X" if X wins - variant diagonal', () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        ["X", null, null],
        [null, "X", null],
        [null, null, "X"],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toStrictEqual("X");
    });
    test('should return "O" if O wins', () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        [null, null, "O"],
        [null, "O", null],
        ["O", null, null],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toStrictEqual("O");
    });
  });

  describe("checkDraw", () => {
    test("should return false if no draw - empty", () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toBeNull();
    });
    test("should return false if no draw", () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        ["X", "O", "X"],
        ["O", "X", "O"],
        ["O", "X", "O"],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toBeNull();
    });

    test("should return true if draw", () => {
      // arrange
      expect.assertions(1);
      const input: Board = [
        ["X", "O", "X"],
        ["O", "X", "O"],
        ["O", "X", "O"],
      ];

      // act
      const result = checkWinner(input);

      // assert
      expect(result).toBeNull();
    });
  });
});
