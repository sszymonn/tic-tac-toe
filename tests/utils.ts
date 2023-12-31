import { BrowserContext, Page, expect } from "@playwright/test";

export const login = async ({ page, context }: {page: Page, context: BrowserContext}) => {
  // Expect sign in button
  await expect(page.getByText(/sign in/i)).toBeVisible();

  process.stdout.write("login debug \n");
  // Expect Auth window
  const authPromise = context.waitForEvent("page");
  process.stdout.write("login debug 2\n");
  // Click sign in button
  await page.getByText(/sign in/i).click();
  process.stdout.write("login debug 3\n");
  // Expect auth window to open
  const authPage = await authPromise;
  
  process.stdout.write("login debug 4\n");
  await authPage.waitForLoadState();
  process.stdout.write("login debug 5\n");

  // Expect create account button
  await expect(authPage.getByText(/add new account/i)).toBeVisible();
  process.stdout.write("login debug 6\n");
  // Click create account button
  await authPage.getByText(/add new account/i).click();
  process.stdout.write("login debug 7\n");
  // Expect autogenerate user information
  await expect(
    authPage.getByText(/auto-generate user information/i)
  ).toBeVisible();

  // Click autogenerate user information
  await authPage.getByText(/auto-generate user information/i).click();

  // Expect sign in button with google.com
  await expect(authPage.getByText(/sign in with google.com/i)).toBeVisible();

  // login debug with google.com
  await authPage.getByText(/sign in with google.com/i).click();
};
