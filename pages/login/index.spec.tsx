/* eslint-disable no-undef */
import {
  render,
  RenderResult,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Login from "./index.page";
import fetchMock from "jest-fetch-mock";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      replace: () => jest.fn(),
      query: {
        redirect: undefined,
      },
    };
  },
}));

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<Login />);
  return { sut };
};

describe("Login Page Elements Test", () => {
  afterEach(cleanup);

  test("Login render test", () => {
    makeSut();
  });

  test("Should have email input.", () => {
    const { sut } = makeSut();
    expect(sut.getByTestId("email-input")).toBeTruthy();
  });

  test("Should have password input.", () => {
    const { sut } = makeSut();
    expect(sut.getByTestId("password-input")).toBeTruthy();
  });

  test("Should have submit button.", () => {
    const { sut } = makeSut();
    expect(sut.getByTestId("submit-button")).toBeTruthy();
  });
});

describe("Login Page Initial State Test", () => {
  afterEach(cleanup);

  test("Should start with submit button enable", () => {
    const { sut } = makeSut();
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;
    expect(submitButton).not.toBeDisabled();
  });
});

describe("Login Submit Event Test", () => {
  afterEach(cleanup);

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
  });

  test("Should keep enable submit button on fire event submit", async () => {
    const { sut } = makeSut();
    const form = sut.getByTestId("form") as HTMLFormElement;
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;
    fireEvent.submit(form);
    await waitFor(() => form);
    expect(submitButton).not.toBeDisabled();
  });

  test("Should keep enable submit button to try again because validation error", async () => {
    const { sut } = makeSut();
    const form = sut.getByTestId("form") as HTMLFormElement;
    const emailInput = sut.getByTestId("email-input") as HTMLInputElement;
    const passwordInput = sut.getByTestId("password-input") as HTMLInputElement;
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;
    fireEvent.input(emailInput, { target: { value: "abc" } });
    fireEvent.input(passwordInput, { target: { value: "abc" } });
    fireEvent.submit(form);
    await waitFor(() => submitButton);
    expect(submitButton).not.toBeDisabled();
  });
});
