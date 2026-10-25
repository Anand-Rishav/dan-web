// Canonical platform values used by the brand intake form's platform chips.
// Must stay in sync with the labels rendered in BrandIntakeModal.
export const PLATFORM_LABELS = ["YouTube", "TikTok", "Instagram", "X / Twitter", "LinkedIn"] as const;

export function platformValue(label: string): string {
  return label.toLowerCase().replace(/ \/ twitter/g, "");
}
