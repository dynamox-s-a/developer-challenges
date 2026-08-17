import "@testing-library/jest-dom/vitest";

// handler pro erro "tF.CSS?.supports is not a function" no teste do Highcharts
if (typeof window.CSS.supports !== "function") {
	window.CSS.supports = () => false;
}
