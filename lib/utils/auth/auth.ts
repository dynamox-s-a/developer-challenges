import { SignInResponse } from "next-auth/client";

export default interface Auth {
  signIn: (
    username: FormDataEntryValue | null,
    password: FormDataEntryValue | null
  ) => Promise<SignInResponse | undefined>;
}
