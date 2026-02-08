import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../store/authSlice";
import Login from "../pages/Login";

const testStore = configureStore({
  reducer: {
    auth: authSlice,
  },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={testStore}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
}

describe("LoginPage", () => {
  it("renders login form", () => {
    render(<Login />, { wrapper: TestWrapper });
    
    expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
