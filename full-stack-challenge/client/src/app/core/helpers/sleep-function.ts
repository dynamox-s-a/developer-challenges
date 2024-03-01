export const sleep = async (ms = 1000) =>
  await new Promise((r) => setTimeout(r, ms))
