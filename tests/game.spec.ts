import { test, expect } from "@playwright/test";
import { login } from "./utils";

const APP_URL = "http://localhost:5173/";

test("can login", async ({ page, context }) => {
  await page.goto(APP_URL);

  // Expect sign in button
  await expect(page.getByText(/sign in/i)).toBeVisible();

  // Expect Auth window
  const authPromise = context.waitForEvent("page");

  // Click sign in button
  await page.getByText(/sign in/i).click();

  // Expect auth window to open
  const authPage = await authPromise;
  await authPage.waitForLoadState();

  // Expect create account button
  await expect(authPage.getByText(/add new account/i)).toBeVisible();

  // Click create account button
  await authPage.getByText(/add new account/i).click();

  // Expect autogenerate user information
  await expect(
    authPage.getByText(/auto-generate user information/i)
  ).toBeVisible();

  // Click autogenerate user information
  await authPage.getByText(/auto-generate user information/i).click();

  // Expect sign in button with google.com
  await expect(authPage.getByText(/sign in with google.com/i)).toBeVisible();

  // Click sign in button with google.com
  await authPage.getByText(/sign in with google.com/i).click();

  // Expect play now button
  await expect(page.getByText(/play now/i)).toBeVisible();
});

test("can play", async ({ page, context }) => {
    await page.goto(APP_URL);
  
    await login({ page, context });
  
    // Expect play now button
    await expect(page.getByText(/play now/i)).toBeVisible();

    // Click play now button
    await page.getByText(/play now/i).click();

    // Expect game waiting for opponent
    await expect(page.getByText(/waiting for another player/i)).toBeVisible();
  });