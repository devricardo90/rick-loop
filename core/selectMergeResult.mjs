export function selectMergeResult(results) {
  const list = Array.isArray(results) ? results : [];
  const blocking = list.find((entry) => entry?.state === "CHANGES_REQUESTED");
  if (blocking) return blocking;
  return list.find((entry) => entry?.independent === true && entry?.clean === true) ?? list.at(-1) ?? null;
}
