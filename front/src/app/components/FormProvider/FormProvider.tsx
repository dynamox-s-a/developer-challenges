"use client";
import { ReactNode } from "react";
import { FormProvider as Form, UseFormReturn } from "react-hook-form";
export type Props = {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
  id?: string;
};
const checkKeyDown = (e: any) => {
  if (e.key === "Enter") e.preventDefault();
};
export default function FormProvider({
  children,
  onSubmit,
  methods,
  id,
}: Props) {
  return (
    <Form {...methods}>
      <form
        id={id}
        onSubmit={onSubmit}
        onKeyDown={(e) => checkKeyDown(e)}
        autoComplete="new-password"
      >
        {children}
      </form>
    </Form>
  );
}
