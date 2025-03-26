import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import { vi } from "vitest";

describe("Navbar", () => {
  it("renders the Navbar for an authenticated user", () => {
    // Mock the functions
    const mockSetIsAuthenticated = vi.fn();
    const mockSetUsername = vi.fn();

    // Render Navbar with props
    render(
      <BrowserRouter>
        <Navbar
          isAuthenticated={true}
          username="Scott"
          setIsAuthenticated={mockSetIsAuthenticated}
          setUsername={mockSetUsername}
        />
      </BrowserRouter>
    );

    // Assertions
    expect(screen.getByText(/movie watchlist/i)).toBeInTheDocument();
    expect(screen.getByText(/hello, scott/i)).toBeInTheDocument(); // fix wording
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.getByText(/my watchlist/i)).toBeInTheDocument();
  });

  it("calls logout function when logout is clicked", () => {
    const mockSetIsAuthenticated = vi.fn();
    const mockSetUsername = vi.fn();

    render(
      <BrowserRouter>
        <Navbar
          isAuthenticated={true}
          username="Scott"
          setIsAuthenticated={mockSetIsAuthenticated}
          setUsername={mockSetUsername}
        />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
    expect(mockSetUsername).toHaveBeenCalledWith(null);
  });
});