import { render, screen } from "@testing-library/react";
import WatchlistPage from "../src/pages/WatchlistPage";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock the API module
vi.mock("../src/services/api", () => ({
  getWatchlist: vi.fn(() => Promise.resolve([])),
}));
describe("WatchlistPage", () => {
  it("renders the Watchlist page and fallback message", async () => {
    render(
      <BrowserRouter>
        <WatchlistPage />
      </BrowserRouter>
    );

    // Header
    expect(screen.getByText("🎬 My Watchlist 🎬")).toBeInTheDocument();

    // Wait for fallback message to appear
    const fallbackMessage = await screen.findByText(/no movies in watchlist/i);
    expect(fallbackMessage).toBeInTheDocument();
  });
});