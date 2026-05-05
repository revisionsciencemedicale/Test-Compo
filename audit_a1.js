const fs = require('fs'); const vm = require('vm');
const files = ['sujets.js','questions.js','questions.auxiliaire1.js','questions.auxiliaire2.js','questions.licence3.ide.js','questions.licence3.sfm.js','questions.eff.js','questions.a1.base.sante.complement.js','questions.normalisation.js'];
const context = { window: {} }; context.window.QUIZ_QUESTIONS_QUIZ = []; context.window.QUIZ_QUESTIONS_EFF = [];
vm.createContext(context);
for (const f of files) { try { vm.runInContext(fs.readFileSync(f,'utf8'), context, {filename:f}); } catch(e) { console.error('ERR',f,e); process.exit(1);} }
const W = context.window;
const level='A1-Base Santé';
let empty=[]; let counts=[];
for (const subject of W.SUBJECTS_BY_LEVEL[level]) {
  const topics = W.SUJETS_PAR_MATIERE_QUIZ[subject] || ['Sujet 1','Sujet 2','Sujet 3','Sujet 4','Sujet 5','Sujet 6'];
  for (const topic of topics) {
    const n = W.QUIZ_QUESTIONS_QUIZ.filter(q=>q.level===level && String(q.subject).trim().toLowerCase()===subject.trim().toLowerCase() && String(q.topic).trim().toLowerCase()===topic.trim().toLowerCase()).length;
    if (!n) empty.push([subject,topic]);
    counts.push(n);
  }
}
console.log(JSON.stringify({subjects:W.SUBJECTS_BY_LEVEL[level].length,totalQuestions:W.QUIZ_QUESTIONS_QUIZ.length,added:W.A1_BASE_SANTE_COMPLEMENT_RAPPORT,emptyCount:empty.length,minCount:Math.min(...counts),maxCount:Math.max(...counts),examplesEmpty:empty.slice(0,10)},null,2));

