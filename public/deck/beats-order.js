/* Draft 5: the 21 pages in reading order (beats are defined across beats-0…3.js). */
(function () {
  var ORDER = ['intro', 'network', 'flows', 'relations', 'northline', 'sources', 'content', 'measurement', 'formal-working', 'cohesion', 'centrality',
    'expertise', 'vulnerability', 'overload', 'content-layer', 'access', 'dynamics', 'reorg', 'interventions', 'evidence', 'privacy', 'human-ai', 'close'];
  window.BEATS.sort(function (a, b) { return ORDER.indexOf(a.id) - ORDER.indexOf(b.id); });
})();
