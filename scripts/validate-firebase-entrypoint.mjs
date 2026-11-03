// Static smoke check for the Law Academy cloud sign-in entrypoint.
// This guards loading and wiring, not successful live Firebase authentication.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const cloud=readFileSync(new URL('../law-firebase-cloud-v4.js',import.meta.url),'utf8');
const config=readFileSync(new URL('../firebase-config.js',import.meta.url),'utf8');
assert.ok(html.includes('src="./firebase-config.js"'),'Firebase config must load before the module');
assert.ok(/import\(['"]\.\/law-firebase-cloud-v4\.js(?:\?[^'"]*)?['"]\)/.test(html),'HTML must load active Firebase cloud v4 module');
assert.ok(html.includes('law-cloud-startup-warning'),'Cloud bootstrap must surface load errors');
assert.ok(html.includes("typeof window.openLawCloud==='function'"),'Cloud sign-in launch must be wired');
assert.ok(cloud.includes('window.openLawCloud'),'Module must register the sign-in launcher');
assert.ok(cloud.includes('onAuthStateChanged'),'Module must handle authentication state');
assert.ok(config.includes('ACADEMY_FIREBASE_CONFIG'),'Firebase web config is missing');
assert.ok(!html.includes('firebase-admin'),'Admin credentials must never load in client HTML');
console.log('PASS: Firebase sign-in assets and HTML bootstrap wiring are present. Live authentication still requires an end-to-end test.');
