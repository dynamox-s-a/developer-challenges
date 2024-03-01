import { format, isValid, parseISO } from "date-fns";
import React from "react";

export interface DateFormatterProps {
  children?: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ children }) => {
  const date = children ? parseISO(children) : "";
  if (!isValid(date)) return null;
  return <>{format(date, "dd/MM/yyyy")}</>;
};

export default DateFormatter;
