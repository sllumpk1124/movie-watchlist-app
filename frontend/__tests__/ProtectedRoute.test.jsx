import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";

// Dummy components
const ProtectedContent = () => <h1>Protected Page</h1>;
const LoginPage = () => <h1>Login Page</h1>;

afterEach(() => {
  localStorage.clear();
});

describe("ProtectedRoute", () => {
  it("renders child component if user is authenticated", () => {
    localStorage.setItem("token", "mock-token");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/protected page/i)).toBeInTheDocument();
  });

  it("redirects to login if user is not authenticated", async () => {
    // No token, simulate logged-out
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});