import { User } from "./userSlice";


export function login() {
  return new Promise<User>((resolve) =>
    setTimeout(
      () =>
        resolve({
          name: "usuario",
          age: 2000,
          jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        }),
      500
    )
  );
}
