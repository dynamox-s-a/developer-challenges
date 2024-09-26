import bcrypt from "bcrypt";

export async function generateHash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function compareHash(password, hash): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
