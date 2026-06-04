import { expect, test } from "@playwright/test";

const ROUTES = [
  { path: "/", title: /Carros|carro certo/i, heading: /perto de você|Encontre/i },
  { path: "/anuncios", title: /Carros/i, heading: /Explorar veículos/i },
  { path: "/publicar", title: /Carros/i, heading: /Vender meu carro/i },
  { path: "/admin", title: /Admin|Carros/i, heading: /Interesses/i },
] as const;

for (const route of ROUTES) {
  test(`GET ${route.path} renders without runtime error`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const response = await page.goto(route.path, { waitUntil: "networkidle" });
    expect(response?.status()).toBeLessThan(400);

    await expect(page.getByText("Runtime Error")).toHaveCount(0);
    await expect(page.getByText("Application error")).toHaveCount(0);
    expect(pageErrors).toEqual([]);

    await expect(page).toHaveTitle(route.title);
    await expect(page.locator("h1").first()).toContainText(route.heading);
  });
}

test("GET /anuncios/ver with valid id shows vehicle detail", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("/anuncios");
  const cards = page.locator("a[href*='anuncios/ver?id=']");
  await cards.first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});
  const count = await cards.count();
  test.skip(count === 0, "Nenhum anúncio no banco — pule este teste ou rode o seed.");

  const firstCard = cards.first();
  const href = await firstCard.getAttribute("href");
  expect(href).toMatch(/id=[a-f0-9-]+/i);

  const response = await page.goto(href!, { waitUntil: "networkidle" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByText("Runtime Error")).toHaveCount(0);
  expect(pageErrors).toEqual([]);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Tenho interesse")).toBeVisible();
});

test("GET /anuncios/ver without id shows message", async ({ page }) => {
  await page.goto("/anuncios/ver");
  await expect(page.getByText(/ID do anúncio não informado/i)).toBeVisible();
});

test("navigation links work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Explorar estoque|Ver anúncios/i }).first().click();
  await expect(page).toHaveURL(/\/anuncios/);

  await page.getByRole("link", { name: /Vender meu carro/i }).first().click();
  await expect(page).toHaveURL(/\/publicar/);
  await expect(page.getByRole("heading", { name: /Vender meu carro/i })).toBeVisible();
});
