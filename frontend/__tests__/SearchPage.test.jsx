// __tests__/SearchPage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchPage from "../src/pages/SearchPage";
import { BrowserRouter } from "react-router-dom";

// ✅ Use `vi.mock` instead of `jest.mock`
vi.mock("../src/services/api", () => ({
  fetchTrendingMovies: vi.fn(() => Promise.resolve([])),
  searchMovies: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: "The Matrix",
        poster_path: "/matrix.jpg",
        release_date: "1999-03-31",
      },
    ])
  ),
}));

describe("SearchPage", () => {
  it("renders search input and button", () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/search for a movie/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("shows search results after submitting query", async () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/search for a movie/i);
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "Matrix" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText(/The Matrix/i)).toBeInTheDocument()
    );
  });
});