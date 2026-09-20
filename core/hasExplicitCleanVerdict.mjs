const CLEAN_VERDICT_PATTERN = /(did\s*n.?t find any major issues|no major issues)/i;

export function hasExplicitCleanVerdict(body) {
  return CLEAN_VERDICT_PATTERN.test(String(body ?? ""));
}
