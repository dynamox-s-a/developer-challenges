import { auth } from "../../../../auth"

export default async function Page() {
    const session = await auth()
    console.log(session)
    if (!session) return <div>Not authenticated</div>
   
    return (
      <div>
        <pre>{JSON.stringify(session.user)}</pre>
      </div>
    )
  }