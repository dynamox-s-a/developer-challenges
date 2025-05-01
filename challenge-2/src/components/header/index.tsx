"use client";

import { useHeaderController } from "./controller";
import { HeaderView } from "./view";

export function Header() {
	const controller = useHeaderController();

	return <HeaderView {...controller} />;
}
