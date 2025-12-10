import * as yup from "yup";
import { EVENT_CATEGORIES } from "./constants";

// Validation schema using Yup
export const eventSchema = yup
  .object({
    name: yup
      .string()
      .required("Event name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be less than 100 characters"),
    dateTime: yup
      .string()
      .required("Date and time is required")
      .test("future-date", "Event date must be in the future", (value) => {
        if (!value) return false;
        return new Date(value) > new Date();
      }),
    location: yup
      .string()
      .required("Location is required")
      .min(3, "Location must be at least 3 characters"),
    description: yup
      .string()
      .required("Description is required")
      .test(
        "min-length",
        "Description must be at least 50 characters",
        (value) => (value?.trim().length || 0) >= 50,
      ),
    category: yup
      .string()
      .required("Category is required")
      .oneOf(EVENT_CATEGORIES as string[], "Please select a valid category"),
  })
  .required();
