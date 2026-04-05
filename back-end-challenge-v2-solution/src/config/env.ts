const DEFAULT_PORT = 3000;
const DEFAULT_MONGODB_URI = "mongodb://localhost:27017";
const DEFAULT_MONGODB_DATABASE = "dynamox";

const parsePort = (value: string | undefined): number => {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
};

export const env = {
  PORT: parsePort(process.env.PORT),
  MONGODB_URI: process.env.MONGODB_URI || DEFAULT_MONGODB_URI,
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || DEFAULT_MONGODB_DATABASE,
};
