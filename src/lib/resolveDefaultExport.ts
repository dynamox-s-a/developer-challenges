export function resolveDefaultExport<T>(value: T): T {
	if (typeof value === 'object' && value !== null && 'default' in value) {
		return (value as { default: T }).default;
	}

	return value;
}
