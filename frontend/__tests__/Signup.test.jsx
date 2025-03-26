import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "../src/pages/Signup";
import "@testing-library/jest-dom";

describe("Signup Page", () => {
  it("renders the signup form and accepts input", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Check form fields
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();

    // Simulate typing
    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(emailInput, { target: { value: "newuser@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    expect(usernameInput.value).toBe("newuser");
    expect(emailInput.value).toBe("newuser@email.com");
    expect(passwordInput.value).toBe("Password123!");
  });
});