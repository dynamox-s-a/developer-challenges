/* eslint-disable no-undef */
import React from "react";
import { useRouter } from "next/router";
import {
  render,
  RenderResult,
  cleanup,
  fireEvent,
  waitFor,
  within,
  screen,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import CreateMonitoringPoint from "./index.page";
import fetchMock from "jest-fetch-mock";

import { userPostResultMsg as postResultMsg } from "lib/utils/post/post-result";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const mockSession = { token: "token", email: "email", name: "name" };
jest.mock("redux/hooks", () => ({
  useAppSelector: () => mockSession,
}));

type SutTypes = {
  sut: RenderResult;
};

const makeSut = async (): Promise<SutTypes> => {
  const sut = await act(async () => render(<CreateMonitoringPoint />));
  return { sut };
};

describe("Create Machine Page Elements Test", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
  });
  afterEach(cleanup);

  test("Create Machine render test", async () => {
    await makeSut();
  });

  test("Should have name input.", async () => {
    const { sut } = await makeSut();
    expect(sut.queryByTestId("name-input")).toBeTruthy();
  });

  test("Should have type input.", async () => {
    const { sut } = await makeSut();
    expect(sut.queryByTestId("type-input")).toBeTruthy();
  });

  test("Should have submit button.", async () => {
    const { sut } = await makeSut();
    expect(sut.queryByTestId("submit-button")).toBeTruthy();
  });

  test("Should have alert error.", async () => {
    const useState = React.useState;
    React.useState = jest
      .fn()
      .mockReturnValueOnce(["error", jest.fn()])
      .mockImplementation((x) => [x, jest.fn()]);
    const { sut } = await makeSut();
    expect(sut.queryByTestId("alert-error")).toBeTruthy();
    React.useState = useState;
  });
});

describe("Create Monitoring Point Page Initial State Test", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
  });
  afterEach(cleanup);

  test("Should start with submit button enable", async () => {
    const { sut } = await makeSut();
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;
    expect(submitButton).not.toBeDisabled();
  });

  test("Should start without alert error", async () => {
    const { sut } = await makeSut();
    const alert = sut.queryByTestId("alert-error") as HTMLInputElement;
    expect(alert).toBeFalsy();
  });
});

describe("Create Monitoring Point Page Error Test", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
  });
  afterEach(cleanup);

  test("Should have alert error and disable button if name field is empty ", async () => {
    const { sut } = await makeSut();

    const typeInput = sut.getByTestId("type-input") as HTMLInputElement;
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;

    const typeButton = within(typeInput).getByRole("button", {
      hidden: true,
    });
    fireEvent.mouseDown(typeButton);
    const typeListbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const typeOptions = within(typeListbox).getAllByRole("option");

    await act(async () => {
      fireEvent.click(typeOptions[0]);
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(
      await waitFor(() => sut.findByTestId("alert-error"))
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test("Should not have alert error and disable button when the form is filled out again", async () => {
    const { sut } = await makeSut();

    const nameInput = sut.getByTestId("name-input") as HTMLInputElement;
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await waitFor(() => sut.findByTestId("alert-error"))
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await act(async () => {
      fireEvent.input(nameInput, { target: { value: "abc" } });
    });

    expect(
      await waitFor(() => sut.queryByTestId("alert-error"))
    ).not.toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });
});

describe("Create User Post Event Test", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.doMock();
  });
  afterEach(cleanup);

  test("Should router to main page if success", async () => {
    fetchMock.mockOnceIf(
      "/api/machine/create",
      JSON.stringify({
        id: 1,
        name: "abc",
        type: "Pump",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );

    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const { sut } = await makeSut();

    const nameInput = sut.getByTestId("name-input") as HTMLInputElement;
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;

    await act(async () => {
      fireEvent.input(nameInput, { target: { value: "abc" } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
  });

  test("Should keep in create user page if server response is a error", async () => {
    fetchMock.mockOnceIf("/api/machine/create", postResultMsg.DATA_CONFLICT, {
      status: 409,
      headers: { "content-type": "application/json" },
    });

    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const { sut } = await makeSut();

    const nameInput = sut.getByTestId("name-input") as HTMLInputElement;
    const submitButton = sut.getByTestId("submit-button") as HTMLInputElement;

    await act(async () => {
      fireEvent.input(nameInput, { target: { value: "abc" } });
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(
      await waitFor(() => sut.findByTestId("alert-error"))
    ).toBeInTheDocument();
  });
});
