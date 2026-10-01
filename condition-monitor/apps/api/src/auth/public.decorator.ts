import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';

/**
 * Opens a route to requests without a session. Every other route is private by default
 * (ADR 0008), so a route whose protection is forgotten stays closed.
 */
export const Public = () => SetMetadata(IS_PUBLIC, true);
