import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LEVEL5_KEY,readLevel5,planLevel5Merge,validateLevel5Cloud} from '../scripts/law-level5-cloud-plan.mjs';
test('Level 5 uses an isolated storage key and strict snapshot schema',()=>{
 assert.equal(LEVEL5_KEY,'law-academy-level5-v1');
 assert.deepEqual(readLevel5(null),{});
 assert.deepEqual(readLevel5('{}'),{});
 for(const raw of ['[]','null','{','{"L4-1-1":{"draft":"x"}}','{"L5-1-1":[]}','{"L5-1-1":null}'])
  assert.throws(()=>readLevel5(raw));
 const x={'L5-1-1':{draft:'retain my exact legal analysis'},'L5-DX-1':{attempted:true,correct:false}};
 assert.deepEqual(readLevel5(JSON.stringify(x)),x);
});
test('disjoint Level 5 writing and diagnostics merge without modifying existing records',()=>{
 const device={'L5-1-1':{draft:'device draft',modelRevealed:false},'L5-DX-1':{correct:true}};
 const cloud={'L5-1-2':{draft:'cloud draft'},'L5-DX-2':{correct:false}};
 const originalDevice=JSON.stringify(device),originalCloud=JSON.stringify(cloud);
 const plan=planLevel5Merge(originalDevice,originalCloud);
 assert.equal(plan.safe,true);
 assert.deepEqual(plan.deviceOnly,['L5-1-1','L5-DX-1']);
 assert.deepEqual(plan.cloudOnly,['L5-1-2','L5-DX-2']);
 assert.deepEqual(JSON.parse(plan.mergedRaw),{...cloud,...device});
 assert.equal(JSON.stringify(device),originalDevice);assert.equal(JSON.stringify(cloud),originalCloud);
});
test('same lesson with different text or scores blocks the entire cloud merge',()=>{
 for(const [a,b] of [[{draft:'version A'},{draft:'version B'}],[{attempted:true,correct:true},{attempted:true,correct:false}],[{draft:'same',correct:true},{draft:'same',correct:true,extra:true}]]){
  const plan=planLevel5Merge(JSON.stringify({'L5-7-20':a}),JSON.stringify({'L5-7-20':b}));
  assert.equal(plan.safe,false);assert.deepEqual(plan.conflicts,['L5-7-20']);assert.equal(plan.mergedRaw,null);
 }
});
test('identical records with different JSON field order do not generate false conflicts',()=>{
 const plan=planLevel5Merge(JSON.stringify({'L5-1-1':{draft:'a',correct:true}}),JSON.stringify({'L5-1-1':{correct:true,draft:'a'}}));
 assert.equal(plan.safe,true);assert.equal(plan.identical,true);
});
test('Level 5 cloud validator refuses wrong academy, snapshot, revision and invalid data',()=>{
 const valid={academy:'law',snapshotType:'level5',schemaVersion:1,revision:3,raw:JSON.stringify({'L5-1-1':{draft:'x'}})};
 assert.deepEqual(validateLevel5Cloud(valid),{revision:3,raw:valid.raw});
 for(const patch of [{academy:'business'},{snapshotType:'level4-finals'},{schemaVersion:2},{revision:0},{revision:'3'},{raw:'[]'},{raw:'{'}])
  assert.throws(()=>validateLevel5Cloud({...valid,...patch}));
});
