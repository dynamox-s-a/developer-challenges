export const categoryOptions = [
  { label: "Conferência", value: "conferencia" },
  { label: "Workshop", value: "workshop" },
  { label: "Webinar", value: "webinar" },
  { label: "Networking", value: "networking" },
  { label: "Outro", value: "outro" },
];

export const categoryMap: Record<string, string> = categoryOptions.reduce(
  (acc, { label, value }) => {
    acc[value] = label;
    return acc;
  },
  {} as Record<string, string>
);

export const categoryColors: Record<
  string,
  "primary" | "secondary" | "error" | "warning" | "info" | "success"
> = {
  Conferência: "primary",
  Workshop: "secondary",
  Webinar: "info",
  Networking: "warning",
  Outro: "success",
};
