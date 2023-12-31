import { test, expect } from "@playwright/test";
import { login } from "./utils";

const APP_URL = "http://localhost:5173/";

test("can login", async ({ page, context }) => {
  await page.goto(APP_URL);

  await login({ page, context });
  
  // Expect play now button
  await expect(page.getByText(/play now/i)).toBeVisible();
});

test("can play", async ({ browser }) => {
  const firstPlayerContext = await browser.newContext();
  const firstPlayerPage = await browser.newPage();

  await firstPlayerPage.goto(APP_URL);

  await login({ page: firstPlayerPage, context: firstPlayerContext });

  // Expect play now button
  await expect(firstPlayerPage.getByText(/play now/i)).toBeVisible();

  // Click play now button
  await firstPlayerPage.getByText(/play now/i).click();

  // Expect game waiting for opponent
  await expect(
    firstPlayerPage.getByText(/waiting for another player/i)
  ).toBeVisible();

  // Second player
  const secondPlayerContext = await browser.newContext();
  const secondPlayerPage = await browser.newPage();
  await secondPlayerPage.goto(APP_URL);
  await login({ page: secondPlayerPage, context: secondPlayerContext });

  // Expect play now button
  await expect(secondPlayerPage.getByText(/play now/i)).toBeVisible();

  // Click play now button
  await secondPlayerPage.getByText(/play now/i).click();

  // Expect game board
  await expect(firstPlayerPage.getByTestId("game-board-0-0")).toBeVisible();
  await expect(secondPlayerPage.getByTestId("game-board-0-0")).toBeVisible();
});
