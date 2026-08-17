import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Typography } from "./Typography";

describe("Typography", () => {
	it("renders the given text", () => {
		render(<Typography text="Hello world" />);
		expect(screen.getByText("Hello world")).toBeInTheDocument();
	});

	it("maps the size prop to the matching semantic tag", () => {
		render(<Typography text="Title" size="h1" />);
		expect(screen.getByText("Title").tagName).toBe("H1");
	});
});
