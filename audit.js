global.window = global;
require('./codes.js');
require('./questions.js');
require('./questions.eff.js');
require('./questions.auxiliaire1.js');
require('./questions.auxiliaire2.js');
require('./questions.licence3.ide.js');
require('./questions.licence3.sfm.js');
require('./questions.normalisation.js');
require('./sujets.js');
require('./sujets.de.js');
const qs=[...(window.QUIZ_QUESTIONS||[]),...(window.QUIZ_QUESTIONS_QUIZ||[]),...(window.QUIZ_QUESTIONS_DE||[])];
console.log(Object.keys(window).filter(k=>k.startsWith('QUIZ_QUESTIONS')));
for (const k of Object.keys(window).filter(k=>k.startsWith('QUIZ_QUESTIONS'))) console.log(k, Array.isArray(window[k])?window[k].length:'no');
function norm(s){return String(s||'').trim().replace(/\s+/g,' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
const quiz=Array.isArray(window.QUIZ_QUESTIONS_QUIZ)?window.QUIZ_QUESTIONS_QUIZ:(window.QUIZ_QUESTIONS||[]);
const bySub={}; for(const q of quiz){let s=q.subject||q.matiere||q.category; let t=q.topic||q.sujet; if(!bySub[s]) bySub[s]=new Set(); if(t) bySub[s].add(t)}
console.log('subjects in questions', Object.keys(bySub).length);
let notInSujets=[]; for(const s of Object.keys(bySub)){ if(!Object.keys(window.SUJETS_PAR_MATIERE_QUIZ).some(k=>norm(k)==norm(s))) notInSujets.push(s)}
console.log('question subjects not in sujets:', notInSujets.length, notInSujets.slice(0,50));
let topicsMissing=[]; for(const [s,set] of Object.entries(bySub)){ const key=Object.keys(window.SUJETS_PAR_MATIERE_QUIZ).find(k=>norm(k)==norm(s)); if(!key) continue; const allowed=(window.SUJETS_PAR_MATIERE_QUIZ[key]||[]).map(norm); for(const t of set){ if(!allowed.includes(norm(t))) topicsMissing.push({s,t,allowed:window.SUJETS_PAR_MATIERE_QUIZ[key]});}}
console.log('topics in questions not in sujets list',topicsMissing.length,topicsMissing.slice(0,30));
let emptyListed=[]; for(const [s,topics] of Object.entries(window.SUJETS_PAR_MATIERE_QUIZ)){ for(const t of topics){ const has=quiz.some(q=>norm(q.subject)==norm(s)&&norm(q.topic)==norm(t)); if(!has) emptyListed.push({s,t}); }}
console.log('listed subject-topic no questions', emptyListed.length, emptyListed.slice(0,30));

