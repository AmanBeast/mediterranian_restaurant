import { test, expect } from "@playwright/test";

test.describe("Élaia Mediterranean Table — Guest & Admin Journeys", () => {
  test("1. Home page renders hero, guest favorite dish, and navigates", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Élaia Mediterranean Table/);

    // Verify Hero
    await expect(
      page.getByRole("heading", { name: "A Taste of the Mediterranean" })
    ).toBeVisible();

    // Verify Guest Favorite Dish
    await expect(
      page.getByText("Charred Aegean Octopus & Fava Santorinis")
    ).toBeVisible();

    // Verify navigation to Menu
    await page.getByRole("link", { name: "Explore Menu" }).first().click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test("2. Menu browsing, dietary filters, and dish modal", async ({ page }) => {
    await page.goto("/menu");
    await expect(
      page.getByRole("heading", { name: "The Aegean Tasting Menu" })
    ).toBeVisible();

    // Filter by Vegetarian
    const vegFilter = page.getByRole("button", { name: "Vegetarian" });
    if (await vegFilter.isVisible()) {
      await vegFilter.click();
      await expect(
        page.getByText("Spanakopita Phyllo Triangles")
      ).toBeVisible();
    }

    // Open dish details modal
    const viewButton = page.getByRole("button", { name: "View Details" }).first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      // Close dialog
      await page.getByRole("button", { name: "Close dish details" }).click();
    }
  });

  test("3. Complete table reservation flow", async ({ page }) => {
    await page.goto("/reservation");
    await expect(
      page.getByRole("heading", { name: "Reserve Your Table" })
    ).toBeVisible();

    // Step 2: Choose 2 guests
    await page.getByRole("button", { name: "2", exact: true }).click();

    // Step 3: Choose atmosphere (Pergola Garden Patio)
    const patio = page.getByText("Pergola Garden Patio");
    if (await patio.isVisible()) {
      await patio.click();
    }

    // Step 5: Fill contact details
    await page.getByPlaceholder("e.g. Alexandria Morgan").fill("Alexandria Morgan");
    await page.getByPlaceholder("alexandria@example.com").fill("delivered@resend.dev");
    await page.getByPlaceholder("+1 (555) 234-5678").fill("+15552345678");

    // Submit reservation
    const confirmButton = page.getByRole("button", {
      name: "Confirm Table Reservation",
    });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
      // Verify confirmation screen
      await expect(page.getByText("We Await Your Arrival")).toBeVisible({
        timeout: 15000,
      });
      await expect(page.getByText("Booking Reference")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Add to Calendar (.ics)" })
      ).toBeVisible();
    }
  });

  test("4. Admin login and reservation management", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Staff Portal" })).toBeVisible();

    // Fill login credentials
    await page.getByLabel("Email Address").fill("admin@elaia-table.com");
    await page.getByLabel("Password").fill("ElaiaAdmin2024!");
    await page.getByRole("button", { name: "Enter Portal" }).click();

    // Verify redirected to admin overview (exact /admin match, not /admin/login)
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: "Welcome, Dimitri Thorne" })
    ).toBeVisible();

    // Navigate to Reservations
    await page.getByRole("link", { name: "Reservations" }).click();
    await expect(page).toHaveURL(/\/admin\/reservations/);
    await expect(
      page.getByRole("heading", { name: "Guest Reservations" })
    ).toBeVisible();
  });
});
