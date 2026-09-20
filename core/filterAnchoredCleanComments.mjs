import { hasExplicitCleanVerdict } from './hasExplicitCleanVerdict.mjs';

export function filterAnchoredCleanComments(comments, headOid) {
  if (!Array.isArray(comments) || !headOid) return [];
  return comments.filter((entry) => {
    const body = entry?.body ?? "";
    if (!hasExplicitCleanVerdict(body)) return false;
    const named = body.match(/reviewed commit:[^0-9a-zA-Z]{0,8}([0-9a-f]{7,40})/i);
    return named ? headOid.startsWith(named[1]) : false;
  });
}
