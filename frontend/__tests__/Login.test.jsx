import { render, screen } from "@testing-library/react";
import Login from "../src/pages/Login"; 
import { BrowserRouter } from "react-router-dom";


describe("Login Page", () => {
  test("renders the login form", () => {
    render(
      <BrowserRouter>
        <Login onLoginSuccess={() => {}} />
      </BrowserRouter>
    );

    // Check if "Login" heading exists
    expect(screen.getByText(/login/i)).toBeInTheDocument();

    // Check if email input is rendered
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();

    // Check if password input is rendered
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();

    // Check if the login button is rendered
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });
});