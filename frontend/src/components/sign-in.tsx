import { signIn } from "../../auth"
 
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <label>
        Email
        <input className="text-black" name="email" type="email" />
      </label>
      <label>
        Password
        <input className="text-black" name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}