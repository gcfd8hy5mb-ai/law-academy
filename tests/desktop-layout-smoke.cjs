/* Non-destructive desktop static acceptance gates. Browser and device testing required separately. */
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html');
const portal=read('desktop-learning-portal.js');
const workspace=read('desktop-legal-workspace.js');
const base=read('desktop-approved-layout.css');
const level=read('desktop-advanced-levels.css');
for(const name of ['desktop-refinement.css','desktop-approved-layout.css','desktop-legal-workspace.js','desktop-learning-portal.css','desktop-learning-portal.js','desktop-advanced-levels.css','desktop-chapter-navigation.js','desktop-chapter-navigation.css','desktop-study-workspaces.js']){
 assert.ok(index.includes('./'+name),name+' must load in HTML');
 assert.ok(fs.existsSync(name),name+' must exist');
}
assert.match(base,/min-width:960px/);
assert.match(base,/law-desktop-workspace/);
assert.match(base,/law-desk-enabled/);
assert.match(level,/level-list/);
assert.match(portal,/getProgress/);
assert.match(portal,/COURSES/);
assert.match(portal,/renderCourse/);
assert.match(portal,/renderLesson|decorateLesson/);
assert.match(workspace,/law-academy-desktop-brief-v1/);
assert.match(workspace,/localStorage\.setItem/);
assert.match(workspace,/Export workspace/);
assert.doesNotMatch(workspace,/law-academy-level[234]-v1/);
assert.doesNotMatch(workspace,/firebase\.firestore|updateDoc|setDoc/);
const scoped=read('desktop-study-workspaces.js'),outline=read('desktop-chapter-navigation.js');
assert.match(scoped,/law-academy-desktop-workspaces-v2/);
assert.match(scoped,/lesson:/);
assert.match(scoped,/localStorage\.setItem/);
assert.match(scoped,/law-academy-desktop-brief-v1/);
assert.match(outline,/law-chapter-outline/);
assert.match(outline,/Previous lesson/);
assert.match(outline,/Next lesson/);
assert.doesNotMatch(scoped,/firebase\.firestore|updateDoc|setDoc/);
console.log('PASS: Desktop assets, responsive conditions, dynamic progress, isolated local workspace.');
console.log('NOTE: This is source-level validation, not a browser screenshot or functional cloud test.');
