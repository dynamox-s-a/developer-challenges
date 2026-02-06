import {z} from "zod";

const envSchema = z.object({})

const env = envSchema.parse(process.env)
export default env