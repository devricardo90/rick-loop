import { isCleanReviewResult } from './isCleanReviewResult.mjs';

export function buildAnchoredResults({ reviews = [], cleanComments = [], headOid, authorLogin = null, unresolvedFindings = null }) {
  if (!headOid) return [];
  const results = [];
  for (const entry of Array.isArray(reviews) ? reviews : []) {
    if (entry?.commit?.oid !== headOid) continue;
    const login = entry.user?.login ?? null;
    results.push({
      ...entry,
      source: "review",
      submittedAt: entry.submittedAt ?? entry.submitted_at ?? null,
      commit: { oid: headOid },
      independent: Boolean(login && login !== authorLogin),
      clean: isCleanReviewResult(entry, unresolvedFindings),
      unresolvedFindings,
    });
  }
  for (const entry of Array.isArray(cleanComments) ? cleanComments : []) {
    const login = entry?.user?.login ?? null;
    const result = { state: "COMMENTED", body: entry?.body ?? "" };
    results.push({
      ...entry,
      source: "clean_comment",
      state: result.state,
      submittedAt: entry?.created_at ?? null,
      commit: { oid: headOid },
      independent: Boolean(login && login !== authorLogin),
      clean: isCleanReviewResult(result, unresolvedFindings),
      unresolvedFindings,
    });
  }
  return results.sort((a, b) => (Date.parse(a.submittedAt) || 0) - (Date.parse(b.submittedAt) || 0));
}
