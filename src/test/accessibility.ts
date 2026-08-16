import axe, { type Result } from 'axe-core';

export async function auditAccessibility(container: Element): Promise<Result[]> {
	const results = await axe.run(container, {
		rules: {
			// JSDOM has no canvas implementation; contrast is validated in browser audits.
			'color-contrast': { enabled: false },
		},
	});
	return results.violations;
}
