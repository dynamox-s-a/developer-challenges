// handler for blunde type error on the Icon component
declare module "@mui/icons-material/esm/*" {
	import type { OverridableComponent } from "@mui/material/OverridableComponent";
	import type { SvgIconTypeMap } from "@mui/material/SvgIcon";

	const Icon: OverridableComponent<SvgIconTypeMap>;
	export default Icon;
}
