export function evaluateMergeAllowed({ currentHead, ci, requiredGatesGreen = false, review = null, unresolvedFindings = null, mergeTimestamp = null }) {
  const reviewTimestamp = review?.submittedAt ? Date.parse(review.submittedAt) : NaN;
  const mergeTime = mergeTimestamp ? Date.parse(mergeTimestamp) : null;
  const checks = {
    exactHeadCiGreen: Boolean(
      currentHead
      && ci?.headSha === currentHead
      && ci?.status === "completed"
      && ci?.conclusion === "success",
    ),
    allRequiredGatesGreen: requiredGatesGreen === true,
    reviewPublished: Number.isFinite(reviewTimestamp),
    reviewExactHead: Boolean(currentHead && review?.commit?.oid === currentHead),
    independentReview: review?.independent === true,
    cleanReview: review?.clean === true,
    zeroUnresolvedFindings: Number.isInteger(unresolvedFindings) && unresolvedFindings === 0,
    reviewPublishedBeforeMerge: mergeTime === null
      ? true
      : Number.isFinite(reviewTimestamp) && reviewTimestamp <= mergeTime,
  };
  return { allowed: Object.values(checks).every(Boolean), checks };
}
