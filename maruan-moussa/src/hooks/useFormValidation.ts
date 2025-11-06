import { useForm, UseFormProps,  type UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { AnyObjectSchema } from "yup";

export function useFormValidation<T extends Record<string, unknown>>(
  schema: AnyObjectSchema,
  options?: UseFormProps<T>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: yupResolver(schema),
    mode: "onChange",
    ...options,
  });
}