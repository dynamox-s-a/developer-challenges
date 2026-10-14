/**
 * Whether a navigation entry matches the current location.
 *
 * The overview lives at `/`, which is a prefix of every other route, so only
 * that entry is matched exactly; the remaining ones also light up on nested
 * paths.
 *
 * Adapted from `lib/is-nav-item-active.ts` in the Devias template (MIT).
 */
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
