import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "./Icon";

describe("Icon", () => {
	it("renders the selected icon as an svg", () => {
		const { container } = render(<Icon icon="Sensors" />);
		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("exposes the text prop as an accessible title", () => {
		render(<Icon icon="Sensors" text="Sensor icon" />);
		expect(screen.getByTitle("Sensor icon")).toBeInTheDocument();
	});
});
