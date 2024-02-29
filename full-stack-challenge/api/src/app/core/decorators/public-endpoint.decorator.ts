import { SetMetadata } from "@nestjs/common";

export const PublicEndpoint = () => SetMetadata("public-endpoint", true);
