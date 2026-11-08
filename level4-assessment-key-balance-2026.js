// Assessment reliability: distribute correct-option positions across the 100 Level 4 knowledge checks.
// Deterministic display order, preserves each correct answer's text, lesson ID and all stored drafts.
(function(){'use strict';const courses=window.LAW_LEVEL4||[];const all=courses.flatMap(c=>c.lessons||[]);
for(let i=0;i<all.length;i++){
 const l=all[i];if(l.answerOrderBalanced2026||!Array.isArray(l.options)||l.options.length!==3||!Number.isInteger(l.answer)||l.answer<0||l.answer>=3)continue;
 const original=l.options[l.answer],desired=i%3;
 const rotated=[...l.options.slice((l.answer-desired+3)%3),...l.options.slice(0,(l.answer-desired+3)%3)];
 if(rotated[desired]!==original)throw new Error('Answer normalization failed: '+l.id);
 l.options=rotated;l.answer=desired;l.answerOrderBalanced2026=true;
}
})();
