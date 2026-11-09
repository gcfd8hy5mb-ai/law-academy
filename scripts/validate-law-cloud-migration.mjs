import assert from 'node:assert/strict';
import {LEGACY_KEYS,LEVEL4_KEY,MIGRATION_KEYS,normalizeSnapshot,planSnapshotMerge,encodeMigratedSnapshot} from './law-cloud-migration-plan.mjs';
const blank=()=>Object.fromEntries(LEGACY_KEYS.map(k=>[k,null]));
const makeLevel4=entries=>JSON.stringify(entries);
let passed=0;
function test(name,fn){fn();passed++;console.log('PASS: '+name)}
test('legacy fixed snapshot normalizes missing Level 4 safely',()=>{
 const older=blank(),normalized=normalizeSnapshot(older);
 assert.equal(normalized[LEVEL4_KEY],null);
 assert.equal(Object.keys(normalized).length,MIGRATION_KEYS.length);
 assert.deepEqual(Object.keys(older),LEGACY_KEYS);
});
test('a device-only Level 4 draft survives legacy cloud import',()=>{
 const device={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'Detailed case reasoning',lastAnswer:1,practiceCorrect:true}})};
 const cloud=blank(),result=planSnapshotMerge(device,cloud);
 assert.equal(result.safe,true);assert.equal(result.merged[LEVEL4_KEY],device[LEVEL4_KEY]);
 assert.equal(JSON.parse(encodeMigratedSnapshot(result.merged))[LEVEL4_KEY],device[LEVEL4_KEY]);
});
test('advanced questions are retained in the separate lesson cloud snapshot',()=>{
 const raw=makeLevel4({'L4-1-11':{draft:'Legal answer',lastAnswer:1,practiceCorrect:true,advancedQuiz2026Choice:2,advancedQuiz2026Correct:false}});
 const device={...blank(),[LEVEL4_KEY]:raw};
 assert.equal(planSnapshotMerge(device,blank()).merged[LEVEL4_KEY],raw);
 assert.equal(normalizeSnapshot(device)[LEVEL4_KEY],raw);
});
test('invalid advanced question state cannot be uploaded',()=>{
 const invalid={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-11':{advancedQuiz2026Choice:7}})};
 assert.throws(()=>normalizeSnapshot(invalid),/advanced quiz choice/);
 const malformed={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-11':{advancedQuiz2026Correct:'yes'}})};
 assert.throws(()=>normalizeSnapshot(malformed),/advanced quiz result/);
});
test('cloud-only drafts and older course progress coexist',()=>{
 const device={...blank(),[LEGACY_KEYS[0]]:JSON.stringify({older:{done:true}})};
 const cloud={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-2-3':{draft:'Cloud essay'}})};
 const result=planSnapshotMerge(device,cloud);
 assert.equal(result.safe,true);assert.equal(result.merged[LEGACY_KEYS[0]],device[LEGACY_KEYS[0]]);
 assert.deepEqual(JSON.parse(result.merged[LEVEL4_KEY]),{'L4-2-3':{draft:'Cloud essay'}});
});
test('disjoint Level 4 lesson IDs merge without replacing either',()=>{
 const device={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'Device text'}})};
 const cloud={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-2-1':{draft:'Cloud text'}})};
 const result=planSnapshotMerge(device,cloud);
 assert.equal(result.safe,true);assert.equal(Object.keys(JSON.parse(result.merged[LEVEL4_KEY])).length,2);
});
test('different nonempty drafts for the same lesson create a hard conflict',()=>{
 const device={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'Device answer'}})};
 const cloud={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'Cloud answer'}})};
 const result=planSnapshotMerge(device,cloud);
 assert.equal(result.safe,false);assert.equal(result.merged,null);
 assert.deepEqual(result.conflicts.map(x=>x.entry),['L4-1-1']);
});
test('same lesson different quiz progress creates a conflict',()=>{
 const device={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'Essay',lastAnswer:1}})};
 const cloud={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'Essay',lastAnswer:2}})};
 assert.equal(planSnapshotMerge(device,cloud).safe,false);
});
test('different prior-level results must never be overwritten',()=>{
 const k='law-academy-level3-v1';
 const device={...blank(),[k]:JSON.stringify({'L3-1-1':{draft:'First answer'}})};
 const cloud={...blank(),[k]:JSON.stringify({'L3-1-1':{draft:'Other answer'}})};
 const result=planSnapshotMerge(device,cloud);assert.equal(result.safe,false);assert.equal(result.conflicts[0].key,k);
});
test('same JSON entries in different insertion orders do not conflict',()=>{
 const left={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'X',lastAnswer:1}})};
 const right={...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{lastAnswer:1,draft:'X'}})};
 assert.equal(planSnapshotMerge(left,right).safe,true);
});
test('malformed, unexpected and oversized snapshots are rejected',()=>{
 assert.throws(()=>normalizeSnapshot('invalid'));
 assert.throws(()=>normalizeSnapshot({...blank(),unexpected:'x'}),/Unexpected snapshot/);
 assert.throws(()=>normalizeSnapshot({...blank(),[LEVEL4_KEY]:'{'}),/Invalid JSON/);
 assert.throws(()=>normalizeSnapshot({...blank(),[LEVEL4_KEY]:JSON.stringify({'L4-8-1':{draft:'x'}})}),/Unexpected Level 4 lesson/);
 assert.throws(()=>normalizeSnapshot({...blank(),[LEVEL4_KEY]:'x'.repeat(1250001)}),/too large/);
});
test('unrecognized progress fields and invalid choices are rejected',()=>{
 assert.throws(()=>normalizeSnapshot({...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{draft:'x',evil:true}})}),/Unexpected Level 4 field/);
 assert.throws(()=>normalizeSnapshot({...blank(),[LEVEL4_KEY]:makeLevel4({'L4-1-1':{lastAnswer:4}})}),/Invalid Level 4 quiz/);
});
test('no Firebase or storage side effects are required',()=>{
 const src=planSnapshotMerge.toString();
 assert.ok(!/localStorage|runTransaction|setDoc|getDoc/.test(src));
});
console.log('PASS: '+passed+' backward-compatibility and no-overwrite scenarios.');
