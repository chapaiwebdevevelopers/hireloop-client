/**
 * Shared Tailwind class constants, so every page uses the same
 * building blocks and restyling happens in one place.
 */

// ---------- Page layout ----------
export const pageContainerClass = "mx-auto w-full space-y-6 p-4 md:p-6";

// ---------- Forms ----------
export const inputLabelClass = "mb-1.5 block text-sm font-medium";

// Selectable chip (radio group styling used by Job Type & Work Mode)
export const chipLabelClass =
  "has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary flex cursor-pointer items-center gap-1.5 rounded-lg border border-input px-2.5 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50";

// ---------- Tables ----------
export const tableHeaderClass =
  "px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase whitespace-nowrap";
export const tableCellClass = "px-4 py-4 align-middle whitespace-nowrap";

// Column visibility — lower-priority columns collapse on smaller screens
export const colTypeClass = "hidden lg:table-cell";
export const colCompensationClass = "hidden lg:table-cell";
export const colApplicantsClass = "hidden xl:table-cell";
export const colDeadlineClass = "hidden md:table-cell";

// ---------- Badges / status ----------
export const activeStatusBadgeClass =
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
export const expiredStatusBadgeClass = "bg-destructive/10 text-destructive";

// Destructive icon-only button (e.g. delete actions)
export const dangerIconButtonClass =
  "text-destructive hover:bg-destructive/10 hover:text-destructive";
