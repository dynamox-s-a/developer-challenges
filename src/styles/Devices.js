export const sizes = {
  mobile: "374px",
  tablet: "768px",
  notebook: "1024px",
};

export const devices = {
  mobile: `(max-width: ${sizes.mobileM})`,
  tablet: `(max-width: ${sizes.tablet})`,
  notebook: `(min-width: ${sizes.laptop})`,
};
