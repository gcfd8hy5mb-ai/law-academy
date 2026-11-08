// Rotate only the 86 newly added advanced questions. Preserve earlier 14 question keys and learner answers.
// Deterministic keyed positions: new group 29/28/29, old group 5/5/4, overall 34/33/33.
(function(){'use strict';
const all=(window.LAW_LEVEL4||[]).flatMap(c=>c.lessons||[]);
const fresh=all.filter(l=>l.advancedQuiz2026&&!['L4-1-11','L4-1-13','L4-2-5','L4-2-13','L4-3-6','L4-3-12','L4-4-4','L4-4-9','L4-5-11','L4-5-13','L4-6-12','L4-6-13','L4-7-11','L4-7-16'].includes(l.id));
if(fresh.length!==86)throw new Error('Expected 86 new advanced questions; got '+fresh.length);
fresh.forEach((l,i)=>{
const q=l.advancedQuiz2026;if(q.rebalanced2026)return;
const original=q.options[q.answer],target=i===85?2:i%3,offset=(q.answer-target+3)%3;
q.options=[...q.options.slice(offset),...q.options.slice(0,offset)];
if(q.options[target]!==original)throw new Error('Key shift mismatch '+l.id);
q.answer=target;q.rebalanced2026=true;
});
})();