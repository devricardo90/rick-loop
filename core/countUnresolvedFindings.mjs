export function countUnresolvedFindings(threads, headOid) {
  if (!Array.isArray(threads) || !headOid) return null;
  return threads.filter((thread) => {
    if (!thread || thread.isResolved === true || thread.isOutdated === true) return false;
    const nodes = Array.isArray(thread.comments?.nodes) ? thread.comments.nodes : thread.comments;
    return (Array.isArray(nodes) ? nodes : []).some((entry) => entry?.commit?.oid === headOid);
  }).length;
}
