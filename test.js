/**
 * BLOODMOON — LUNAR EXPLORER — Suíte de Testes Automatizados (Node.js)
 * Execução: node test.js
 */

const fs = require('fs');
const path = require('path');

const dir = __dirname;
let passCount = 0;
let failCount = 0;
const results = [];

function assertTest(name, condition, details = '') {
    if (condition) {
        passCount++;
        results.push({ name, status: 'PASS', details });
        console.log(`  \x1b[32m✔ PASS\x1b[0m ${name}`);
    } else {
        failCount++;
        results.push({ name, status: 'FAIL', details });
        console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name}${details ? ` -> ${details}` : ''}`);
    }
}

console.log('\n============================================================');
console.log('🌕 SUÍTE DE TESTES: BLOODMOON — LUNAR EXPLORER');
console.log('============================================================\n');

// ── GRUPO 1: ARQUIVOS ESSENCIAIS ───────────────────────────
console.log('\x1b[1m[1/6] Integridade de Arquivos\x1b[0m');
const requiredFiles = ['index.html', 'style.css', 'script.js', 'README.md', 'CONTRIBUTING.md', 'SPEC.md'];
for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(dir, file));
    assertTest(`Arquivo existe: ${file}`, exists);
}

const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf-8');
const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf-8');
const js = fs.readFileSync(path.join(dir, 'script.js'), 'utf-8');
const scriptExports = require(path.join(dir, 'script.js'));

// ── GRUPO 2: ESTRUTURA HTML & ACESSIBILIDADE (A11Y) ────────
console.log('\n\x1b[1m[2/6] Estrutura HTML & Acessibilidade\x1b[0m');
assertTest('Título contém BloodMoon — Lunar Explorer', html.includes('BloodMoon — Lunar Explorer'));
assertTest('Vinculação correta de style.css', /href=["']style\.css["']/.test(html));
assertTest('Vinculação correta de script.js', /src=["']script\.js["']/.test(html));
assertTest('Skip link para acessibilidade de teclado', html.includes('class="skip-link"'));
assertTest('Declaração de idioma pt-BR', html.includes('lang="pt-BR"'));
assertTest('Meta viewport responsivo configurado', html.includes('name="viewport"'));
assertTest('Três abas de módulos configuradas com data-tab', 
    html.includes('data-tab="explorer"') &&
    html.includes('data-tab="simulator"') &&
    html.includes('data-tab="quiz"')
);
assertTest('Atributos ARIA estruturais (tablist, tab, tabpanel)', 
    html.includes('role="tablist"') &&
    html.includes('role="tab"') &&
    html.includes('role="tabpanel"') &&
    html.includes('aria-selected') &&
    html.includes('aria-controls')
);
assertTest('Regiões dinâmicas com aria-live', html.includes('aria-live="polite"') && html.includes('aria-live="assertive"'));
assertTest('Aviso educativo de simulação no simulador (especificação)', 
    html.includes('sim-disclaimer') &&
    (html.includes('simulação educativa') || html.includes('reprodução astronômica'))
);

// ── GRUPO 3: MÓDULO 1 — AS 8 FASES LUNARES ─────────────────
console.log('\n\x1b[1m[3/6] Módulo 1: Oito Fases Lunares (Conforme Especificação)\x1b[0m');
const expectedPhases = [
    'Lua Nova',
    'Lua Crescente',
    'Quarto Crescente',
    'Lua Gibosa Crescente',
    'Lua Cheia',
    'Lua Gibosa Minguante',
    'Quarto Minguante',
    'Lua Minguante'
];

assertTest('Array LUNAR_PHASES contém exatamente 8 fases', scriptExports.LUNAR_PHASES.length === 8);

expectedPhases.forEach((phaseName, index) => {
    const phase = scriptExports.LUNAR_PHASES[index];
    const match = phase && phase.name === phaseName;
    assertTest(
        `Fase ${index + 1} corresponde a "${phaseName}"`,
        match,
        phase ? `Encontrado: "${phase.name}"` : 'Fase indefinida'
    );
    if (phase) {
        assertTest(`Fase ${index + 1} possui descrição e iluminação válidas`, 
            Boolean(phase.description && phase.illumination && phase.cycleDay && phase.cssClass)
        );
    }
});

// ── GRUPO 4: MÓDULO 2 — SIMULADOR & PRECISÃO ASTRONÔMICA ────
console.log('\n\x1b[1m[4/6] Módulo 2: Precisão Astronômica do Simulador\x1b[0m');
assertTest('Período sinódico definido como ~29.53 dias', Math.abs(scriptExports.SYNODIC_PERIOD - 29.53) < 0.01);

const dayTestCases = [
    { day: 0.0, expectedIndex: 0, phaseName: 'Lua Nova' },
    { day: 3.7, expectedIndex: 1, phaseName: 'Lua Crescente' },
    { day: 7.0, expectedIndex: 2, phaseName: 'Quarto Crescente' },
    { day: 11.0, expectedIndex: 3, phaseName: 'Lua Gibosa Crescente' },
    { day: 14.8, expectedIndex: 4, phaseName: 'Lua Cheia' },
    { day: 18.5, expectedIndex: 5, phaseName: 'Lua Gibosa Minguante' },
    { day: 22.0, expectedIndex: 6, phaseName: 'Quarto Minguante' },
    { day: 26.0, expectedIndex: 7, phaseName: 'Lua Minguante' },
    { day: 29.5, expectedIndex: 0, phaseName: 'Lua Nova' },
];

for (const tc of dayTestCases) {
    const idx = scriptExports.dayToPhaseIndex(tc.day);
    assertTest(
        `Dia ${tc.day} mapeia para Fase ${tc.expectedIndex} (${tc.phaseName})`,
        idx === tc.expectedIndex,
        `Obtido: ${idx} (${scriptExports.LUNAR_PHASES[idx]?.name})`
    );
}

assertTest('Controles do simulador presentes no HTML',
    html.includes('id="sim-btn-start"') &&
    html.includes('id="sim-btn-pause"') &&
    html.includes('id="sim-btn-reset"') &&
    html.includes('id="sim-day"') &&
    html.includes('id="sim-progress-bar"')
);

// ── GRUPO 5: MÓDULO 3 — QUIZ LUNAR ─────────────────────────
console.log('\n\x1b[1m[5/6] Módulo 3: Validação do Quiz Lunar\x1b[0m');
const questions = scriptExports.QUIZ_QUESTIONS;
assertTest('Banco de questões contém exatamente 10 perguntas', questions.length === 10);

questions.forEach((q, i) => {
    const hasQuestionText = typeof q.question === 'string' && q.question.trim().length > 10;
    const hasFourOptions = Array.isArray(q.options) && q.options.length === 4;
    const hasValidCorrect = typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3;
    const hasExplanation = typeof q.explanation === 'string' && q.explanation.trim().length > 15;
    const uniqueOptions = hasFourOptions && (new Set(q.options)).size === 4;

    assertTest(
        `Questão ${i + 1}: estrutura completa (4 opções únicas, resposta válida, explicação)`,
        hasQuestionText && hasFourOptions && hasValidCorrect && hasExplanation && uniqueOptions,
        `Opções: ${q.options ? q.options.length : 0}, Correta: ${q.correct}`
    );
});

assertTest('Proteção contra pontuação dupla implementada em handleAnswer', 
    js.includes('if (answered) return')
);

// ── GRUPO 6: ESTILIZAÇÃO CSS & RESPONSIVIDADE ───────────────
console.log('\n\x1b[1m[6/6] Estilos CSS & Responsividade\x1b[0m');
for (let i = 0; i <= 7; i++) {
    assertTest(`Classe CSS da fase .moon-phase-${i} definida`, css.includes(`.moon-phase-${i}`));
}

const mediaQueryCount = (css.match(/@media/g) || []).length;
assertTest(`CSS responsivo possui media queries adequadas (encontradas: ${mediaQueryCount})`, mediaQueryCount >= 4);
assertTest('Suporte para prefers-reduced-motion configurado no CSS', css.includes('prefers-reduced-motion'));
assertTest('Definição de clip-path para fases lunares no CSS', css.includes('clip-path:'));

// ── RELATÓRIO FINAL ─────────────────────────────────────────
console.log('\n============================================================');
console.log(`TOTAL DE TESTES: ${passCount + failCount} | APROVADOS: \x1b[32m${passCount}\x1b[0m | FALHAS: \x1b[31m${failCount}\x1b[0m`);
console.log('============================================================\n');

if (failCount > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
