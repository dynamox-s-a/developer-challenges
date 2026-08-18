import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Flex } from "./Flex";

describe("Flex", () => {
	it("renders its children", () => {
		render(
			<Flex>
				<span>Child A</span>
				<span>Child B</span>
			</Flex>,
		);
		expect(screen.getByText("Child A")).toBeInTheDocument();
		expect(screen.getByText("Child B")).toBeInTheDocument();
	});

	it("applies flex-direction from the direction prop", () => {
		const { container } = render(
			<Flex direction="column">
				<span>Child</span>
			</Flex>,
		);
		expect(container.firstChild).toHaveStyle({ flexDirection: "column" });
	});
});
