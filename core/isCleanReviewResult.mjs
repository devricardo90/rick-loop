import { hasExplicitCleanVerdict } from './hasExplicitCleanVerdict.mjs';

export function isCleanReviewResult(review, unresolvedFindings) {
  if (!review) return false;
  if (!Number.isInteger(unresolvedFindings) || unresolvedFindings !== 0) return false;
  if (review.state === "APPROVED") return true;
  if (review.state === "COMMENTED") return hasExplicitCleanVerdict(review.body);
  return false;
}
