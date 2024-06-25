'use server'
import { auth } from "../../auth"

export async function getSessionData() {
  const sessionData = await auth();
  return sessionData;
}