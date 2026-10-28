/**
 * BLOODMOON — LUNAR EXPLORER — script.js
 * Responsabilidades:
 *  1. Canvas de estrelas animado com respeito a visibilidade e preferências de movimento
 *  2. Navegação por abas com acessibilidade ARIA completa e atalhos de teclado
 *  3. Módulo 1 — Explorador Lunar (8 fases principais, navegação circular)
 *  4. Módulo 2 — Simulador do Ciclo Lunar (29,53 dias, controles, velocidade, barra de progresso)
 *  5. Módulo 3 — Quiz Lunar (10 perguntas educativas, sem duplicidade de pontuação, feedback imediato)
 */

'use strict';

/* ============================================================
   0. DADOS: FASES LUNARES (8 Fases Principais da Especificação)
   ============================================================ */
const LUNAR_PHASES = [
    {
        id: 0,
        name: 'Lua Nova',
        illumination: '0%',
        cycleDay: '~Dia 0',
        cssClass: 'moon-phase-0',
        description:
            'Na Lua Nova, a Lua se posiciona entre a Terra e o Sol. O lado voltado para a Terra está completamente na sombra, tornando a Lua invisível a olho nu. É o início do ciclo sinódico, com duração total de aproximadamente 29,53 dias.',
    },
    {
        id: 1,
        name: 'Lua Crescente',
        illumination: '~1% – 49%',
        cycleDay: '~Dia 1–6',
        cssClass: 'moon-phase-1',
        description:
            'Poucos dias após a Lua Nova, uma fina faixa iluminada aparece à direita (no hemisfério sul, à esquerda). A porção crescente indica que a Lua está se afastando do alinhamento com o Sol, revelando gradualmente a face iluminada.',
    },
    {
        id: 2,
        name: 'Quarto Crescente',
        illumination: '50%',
        cycleDay: '~Dia 7',
        cssClass: 'moon-phase-2',
        description:
            'No Quarto Crescente, metade da face lunar visível está iluminada — a metade direita (no hemisfério norte). A Lua forma um ângulo de aproximadamente 90° com o Sol em relação à Terra. É uma das quatro fases primárias do ciclo.',
    },
    {
        id: 3,
        name: 'Lua Gibosa Crescente',
        illumination: '~51% – 99%',
        cycleDay: '~Dia 8–13',
        cssClass: 'moon-phase-3',
        description:
            'A Lua Gibosa Crescente exibe mais da metade da face iluminada. O termo "gibosa" vem do latim gibbus, que significa corcunda ou abaulada. A Lua aparece como um disco quase completo, aproximando-se da Lua Cheia.',
    },
    {
        id: 4,
        name: 'Lua Cheia',
        illumination: '100%',
        cycleDay: '~Dia 14–15',
        cssClass: 'moon-phase-4',
        description:
            'Na Lua Cheia, a Terra se posiciona entre a Lua e o Sol. Toda a face voltada para a Terra recebe luz solar direta, tornando a Lua completamente visível e brilhante. É a fase de maior iluminação e ocorre aproximadamente na metade do ciclo.',
    },
    {
        id: 5,
        name: 'Lua Gibosa Minguante',
        illumination: '~99% – 51%',
        cycleDay: '~Dia 16–21',
        cssClass: 'moon-phase-5',
        description:
            'Após a Lua Cheia, a porção iluminada começa a diminuir pelo lado esquerdo (no hemisfério norte). A Lua Gibosa Minguante ainda exibe uma grande área iluminada, mas a tendência é de redução progressiva até o Quarto Minguante.',
    },
    {
        id: 6,
        name: 'Quarto Minguante',
        illumination: '50%',
        cycleDay: '~Dia 22',
        cssClass: 'moon-phase-6',
        description:
            'No Quarto Minguante, exatamente metade da face visível está iluminada (metade esquerda no hemisfério norte). Assim como o Quarto Crescente, forma um ângulo de 90° com o Sol, mas agora com a iluminação decrescendo rumo à escuridão.',
    },
    {
        id: 7,
        name: 'Lua Minguante',
        illumination: '~49% – 1%',
        cycleDay: '~Dia 23–28',
        cssClass: 'moon-phase-7',
        description:
            'Na Lua Minguante, resta apenas uma sutil foice iluminada no céu da madrugada. A Lua está se aproximando novamente do alinhamento com o Sol, encerrando o ciclo sinódico antes de reiniciar na Lua Nova.',
    },
];

/* Duração do ciclo sinódico em dias astronômicos */
const SYNODIC_PERIOD = 29.53;

/**
 * Retorna o índice da fase correspondente a um dia do ciclo (0..29.53)
 * Centraliza os intervalos ao redor dos pontos nominais das 8 fases:
 *  - Fase 0 (Lua Nova): ~Dia 0 (27.68 .. 29.53 e 0.00 .. 1.85)
 *  - Fase 1 (Lua Crescente): ~Dia 3.7 (1.85 .. 5.54)
 *  - Fase 2 (Quarto Crescente): ~Dia 7.4 (5.54 .. 9.23)
 *  - Fase 3 (Lua Gibosa Crescente): ~Dia 11.1 (9.23 .. 12.92)
 *  - Fase 4 (Lua Cheia): ~Dia 14.8 (12.92 .. 16.61)
 *  - Fase 5 (Lua Gibosa Minguante): ~Dia 18.5 (16.61 .. 20.30)
 *  - Fase 6 (Quarto Minguante): ~Dia 22.1 (20.30 .. 23.99)
 *  - Fase 7 (Lua Minguante): ~Dia 25.8 (23.99 .. 27.68)
 */
function dayToPhaseIndex(day) {
    const segment = SYNODIC_PERIOD / 8;
    const normalizedDay = ((day + segment / 2) % SYNODIC_PERIOD + SYNODIC_PERIOD) % SYNODIC_PERIOD;
    return Math.floor(normalizedDay / segment);
}

/* ============================================================
   1. CANVAS DE ESTRELAS
   ============================================================ */
function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars = [];
    let animationId = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStars();
    }

    function generateStars() {
        const count = Math.floor((canvas.width * canvas.height) / 4000);
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.4 + 0.2,
                alpha: Math.random(),
                speed: Math.random() * 0.008 + 0.002,
                dir: Math.random() > 0.5 ? 1 : -1,
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const s of stars) {
            s.alpha += s.speed * s.dir;
            if (s.alpha > 1 || s.alpha < 0) s.dir *= -1;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, s.alpha)).toFixed(2)})`;
            ctx.fill();
        }
        animationId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    // Pausar renderização quando a aba estiver em segundo plano para economia de bateria
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else if (!animationId) {
            draw();
        }
    });
}

/* ============================================================
   2. NAVEGAÇÃO POR ABAS
   ============================================================ */
function initTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.tab-section');

    function activateTab(tabId) {
        navBtns.forEach(btn => {
            const isActive = btn.dataset.tab === tabId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });

        sections.forEach(section => {
            const matches = section.id === `section-${tabId}`;
            section.hidden = !matches;
            section.classList.toggle('active', matches);
        });
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => activateTab(btn.dataset.tab));
        btn.addEventListener('keydown', e => {
            // Navegação por teclado entre abas (ArrowLeft e ArrowRight)
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const all = [...navBtns];
                const idx = all.indexOf(btn);
                const next = e.key === 'ArrowRight'
                    ? all[(idx + 1) % all.length]
                    : all[(idx - 1 + all.length) % all.length];
                next.focus();
                activateTab(next.dataset.tab);
            }
        });
    });

    // Hambúrguer mobile
    const hamburger = document.getElementById('hamburger-btn');
    const navList = document.querySelector('.nav-list');
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            const open = navList.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(open));
        });

        // Fechar menu ao clicar numa aba
        navBtns.forEach(btn => btn.addEventListener('click', () => {
            navList.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }));

        // Fechar menu com a tecla Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navList.classList.contains('open')) {
                navList.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus();
            }
        });
    }
}

/* ============================================================
   3. MÓDULO 1 — EXPLORADOR LUNAR (RF01–RF04)
   ============================================================ */
let explorerSelectedIndex = -1;

function initExplorer() {
    const grid = document.getElementById('phases-grid');
    const moonVisual = document.getElementById('moon-visual');
    const phaseName = document.getElementById('phase-name');
    const phasePos = document.getElementById('phase-cycle-position');
    const phaseIll = document.getElementById('phase-illumination');
    const phaseDesc = document.getElementById('phase-description');
    const phaseCount = document.getElementById('phase-counter');
    const btnPrev = document.getElementById('btn-prev-phase');
    const btnNext = document.getElementById('btn-next-phase');

    if (!grid || !moonVisual || !phaseName || !btnPrev || !btnNext) return;

    grid.innerHTML = '';

    // Gerar cartões da grade
    LUNAR_PHASES.forEach((phase, i) => {
        const card = document.createElement('button');
        card.className = 'phase-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `Fase ${i + 1}: ${phase.name}`);
        card.dataset.index = String(i);

        // Mini Lua
        const miniMoon = document.createElement('div');
        miniMoon.className = `phase-mini-moon ${phase.cssClass}`;
        miniMoon.setAttribute('aria-hidden', 'true');

        const label = document.createElement('span');
        label.className = 'phase-card-name';
        label.textContent = phase.name;

        card.appendChild(miniMoon);
        card.appendChild(label);
        grid.appendChild(card);

        // Clique e teclado selecionam a fase
        card.addEventListener('click', () => selectPhase(i));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectPhase(i);
            }
        });
    });

    function selectPhase(index) {
        explorerSelectedIndex = index;
        const phase = LUNAR_PHASES[index];

        // Atualizar cartões da grade
        document.querySelectorAll('.phase-card').forEach((card, i) => {
            card.classList.toggle('selected', i === index);
            card.setAttribute('aria-pressed', String(i === index));
        });

        // Atualizar Lua no painel
        moonVisual.className = `moon ${phase.cssClass}`;
        moonVisual.setAttribute('aria-label', `Lua — ${phase.name}, iluminação ${phase.illumination}`);

        // Atualizar textos informativos
        phaseName.textContent = phase.name;
        phasePos.textContent = `Posição: ${phase.cycleDay}`;
        phaseIll.textContent = `Iluminação: ${phase.illumination}`;
        phaseDesc.textContent = phase.description;
        phaseCount.textContent = `${index + 1} / ${LUNAR_PHASES.length}`;

        // Habilitar botões de navegação
        btnPrev.disabled = false;
        btnNext.disabled = false;
    }

    // Botões anterior / próximo (navegação circular — RF04)
    btnPrev.addEventListener('click', () => {
        const prev = (explorerSelectedIndex - 1 + LUNAR_PHASES.length) % LUNAR_PHASES.length;
        selectPhase(prev);
    });

    btnNext.addEventListener('click', () => {
        const next = (explorerSelectedIndex + 1) % LUNAR_PHASES.length;
        selectPhase(next);
    });

    // Selecionar a primeira fase por padrão
    selectPhase(0);
}

/* ============================================================
   4. MÓDULO 2 — SIMULADOR DO CICLO LUNAR (RF05–RF08)
   ============================================================ */
function initSimulator() {
    const simMoon = document.getElementById('sim-moon');
    const simDay = document.getElementById('sim-day');
    const simPhLabel = document.getElementById('sim-phase-label');
    const simPhName = document.getElementById('sim-phase-name');
    const simProgress = document.getElementById('sim-progress-bar');
    const simPct = document.getElementById('sim-progress-pct');
    const btnStart = document.getElementById('sim-btn-start');
    const btnPause = document.getElementById('sim-btn-pause');
    const btnReset = document.getElementById('sim-btn-reset');
    const speedBtns = document.querySelectorAll('.speed-btn');

    if (!simMoon || !simDay || !simProgress || !btnStart || !btnPause || !btnReset) return;

    // Estado da simulação
    let running = false;
    let rafId = null;
    let lastTimestamp = null;
    let currentDay = 0;   // dia astronômico atual (0..29.53)
    let speedFactor = 1;  // multiplicador de velocidade

    /**
     * Velocidade base: 1 segundo real equivale a 1 dia lunar a 1× de velocidade.
     * Assim, o ciclo sinódico completo dura ≈ 29,53 segundos reais a 1×,
     * permitindo uma visualização clara e didática da progressão das fases.
     */
    const MS_PER_LUNAR_DAY_AT_1X = 1000;

    function updateUI(day) {
        const phaseIdx = dayToPhaseIndex(day);
        const phase = LUNAR_PHASES[phaseIdx];
        const pct = (day / SYNODIC_PERIOD) * 100;

        simMoon.className = `moon sim-moon ${phase.cssClass}`;
        simMoon.setAttribute('aria-label', `Simulador — ${phase.name}`);
        simDay.textContent = day.toFixed(1);
        if (simPhLabel) simPhLabel.textContent = phase.name;
        if (simPhName) simPhName.textContent = phase.name;

        const pctRounded = Math.min(Math.round(pct), 100);
        simProgress.style.width = `${pctRounded}%`;
        simProgress.setAttribute('aria-valuenow', pctRounded);
        simProgress.setAttribute('aria-valuetext', `${pctRounded}% do ciclo sinódico concluído`);
        if (simPct) simPct.textContent = pctRounded;
    }

    function tick(timestamp) {
        if (!running) return;

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const elapsed = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        // Avançar dias proporcionalmente ao tempo decorrido e à velocidade
        const daysElapsed = (elapsed * speedFactor) / MS_PER_LUNAR_DAY_AT_1X;
        currentDay = (currentDay + daysElapsed) % SYNODIC_PERIOD;

        updateUI(currentDay);

        rafId = requestAnimationFrame(tick);
    }

    function startSim() {
        if (running) return;
        running = true;
        lastTimestamp = null;
        rafId = requestAnimationFrame(tick);

        btnStart.textContent = '▶ Continuar';
        btnStart.disabled = true;
        btnPause.disabled = false;
    }

    function pauseSim() {
        if (!running) return;
        running = false;
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        lastTimestamp = null;

        btnStart.disabled = false;
        btnPause.disabled = true;
    }

    function resetSim() {
        if (running) pauseSim();
        currentDay = 0;
        updateUI(0);

        btnStart.textContent = '▶ Iniciar';
        btnStart.disabled = false;
        btnPause.disabled = true;
    }

    function setSpeed(factor) {
        speedFactor = factor;
        speedBtns.forEach(btn => {
            const active = Number(btn.dataset.speed) === factor;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', String(active));
        });
    }

    btnStart.addEventListener('click', startSim);
    btnPause.addEventListener('click', pauseSim);
    btnReset.addEventListener('click', resetSim);

    speedBtns.forEach(btn => {
        btn.addEventListener('click', () => setSpeed(Number(btn.dataset.speed)));
    });

    // Estado inicial
    updateUI(0);
    btnPause.disabled = true;
}

/* ============================================================
   5. MÓDULO 3 — QUIZ LUNAR (RF09–RF12)
   ============================================================ */

/**
 * Banco de perguntas (10 questões conforme especificação)
 * Cada pergunta possui 4 alternativas e apenas 1 correta.
 */
const QUIZ_QUESTIONS = [
    {
        question: 'Qual é a duração aproximada do ciclo lunar completo (de uma Lua Nova à próxima)?',
        options: ['27,3 dias', '29,53 dias', '30 dias', '24 horas'],
        correct: 1,
        explanation:
            'O ciclo sinódico da Lua — de uma Lua Nova à próxima — tem duração de aproximadamente 29,53 dias. O período de 27,3 dias é o ciclo sidéreo, medido em relação às estrelas distantes.',
    },
    {
        question: 'O que causa as diferentes fases da Lua vistas da Terra?',
        options: [
            'A sombra projetada pela Terra sobre a superfície lunar',
            'A rotação da Lua em torno de seu próprio eixo gravitacional',
            'A mudança contínua do ângulo de iluminação solar visível a partir da Terra',
            'A variação da distância elíptica entre a Terra e a Lua',
        ],
        correct: 2,
        explanation:
            'As fases ocorrem porque a Lua orbita a Terra e, conforme muda o ângulo entre Sol, Lua e Terra, observamos diferentes frações de sua metade iluminada. Não é causada pela sombra da Terra (que origina os eclipses).',
    },
    {
        question: 'Na fase de Lua Nova, qual é o percentual aproximado de iluminação visível da Terra?',
        options: ['50%', '25%', '0%', '100%'],
        correct: 2,
        explanation:
            'Na Lua Nova, a Lua se posiciona entre a Terra e o Sol. O lado voltado para nós não recebe luz solar direta, de modo que sua iluminação visível é de aproximadamente 0%.',
    },
    {
        question: 'Qual fase ocorre aproximadamente no Dia 7 do ciclo lunar sinódico?',
        options: ['Lua Cheia', 'Quarto Crescente', 'Lua Gibosa Crescente', 'Lua Crescente'],
        correct: 1,
        explanation:
            'O Quarto Crescente ocorre por volta do 7º dia do ciclo. Nessa fase, exatamente metade da face lunar visível da Terra está iluminada, formando um ângulo de 90° em relação ao Sol.',
    },
    {
        question: 'Qual é a principal distinção entre as fases crescentes e minguantes da Lua?',
        options: [
            'Nas fases crescentes a Lua fica mais próxima da órbita terrestre',
            'Nas fases crescentes a área iluminada visível aumenta; nas minguantes, diminui',
            'Nas fases minguantes a Lua reflete luz solar de tonalidade avermelhada',
            'Nas fases crescentes a Lua só pode ser observada exatamente à meia-noite',
        ],
        correct: 1,
        explanation:
            'As fases crescentes (da Lua Nova à Lua Cheia) apresentam expansão gradual da área iluminada. As fases minguantes (da Lua Cheia à próxima Lua Nova) apresentam redução contínua da porção iluminada visível.',
    },
    {
        question: 'Em qual configuração geométrica e posicional ocorre a Lua Cheia?',
        options: [
            'A Lua está posicionada entre a Terra e o Sol',
            'A Terra está alinhada entre a Lua e o Sol',
            'O Sol está posicionado entre a Terra e a Lua',
            'A Lua está perpendicular ao plano orbital Terra-Sol',
        ],
        correct: 1,
        explanation:
            'Na Lua Cheia, a Terra está posicionada entre o Sol e a Lua, permitindo que toda a face lunar voltada para nós receba iluminação solar direta, gerando 100% de visibilidade.',
    },
    {
        question: 'Em qual fase do ciclo lunar o disco visível atinge 100% de iluminação?',
        options: ['Quarto Crescente', 'Lua Gibosa Crescente', 'Lua Nova', 'Lua Cheia'],
        correct: 3,
        explanation:
            'A Lua Cheia é a fase em que toda a metade voltada para a Terra é iluminada diretamente pelos raios solares, refletindo o brilho máximo no céu noturno.',
    },
    {
        question: 'Astronomicamente, quantas são as fases primárias que marcam as mudanças de quarto no ciclo lunar (ângulos de 0°, 90°, 180° e 270°)?',
        options: ['2', '4', '6', '8'],
        correct: 1,
        explanation:
            'As 4 fases primárias (cardeais) são Lua Nova (0°), Quarto Crescente (90°), Lua Cheia (180°) e Quarto Minguante (270°). Intercaladas a elas estão as 4 fases intermediárias (Lua Crescente, Lua Gibosa Crescente, Lua Gibosa Minguante e Lua Minguante), totalizando as 8 fases do ciclo.',
    },
    {
        question: 'A Lua é um corpo celeste que produz luz própria?',
        options: [
            'Sim, ela emite radiação luminosa por fusão nuclear',
            'Somente durante a fase de Lua Cheia',
            'Não; ela apenas reflete a luz emitida pelo Sol',
            'Não; ela retém e irradia calor geotérmico residual',
        ],
        correct: 2,
        explanation:
            'A Lua é um satélite natural não luminoso (corpo iluminado). Ela não produz luz própria, apenas reflete a radiação solar que atinge sua superfície.',
    },
    {
        question: 'Qual fase segue imediatamente após o Quarto Minguante, antecedendo a próxima Lua Nova?',
        options: ['Lua Gibosa Minguante', 'Lua Crescente', 'Lua Minguante', 'Lua Cheia'],
        correct: 2,
        explanation:
            'Após o Quarto Minguante (por volta do Dia 22), a porção iluminada continua a minguar na fase de Lua Minguante (também chamada de minguante balsâmica), até desaparecer completamente no início de uma nova Lua Nova.',
    },
];

function initQuiz() {
    const quizCard = document.getElementById('quiz-card');
    const progressBar = document.getElementById('quiz-progress-bar');
    const progressLabel = document.getElementById('quiz-progress-label');
    const resultDiv = document.getElementById('quiz-result');
    const resultScore = document.getElementById('quiz-result-score');
    const resultMsg = document.getElementById('quiz-result-msg');
    const btnStartQuiz = document.getElementById('quiz-btn-start');
    const btnRestartQuiz = document.getElementById('quiz-btn-restart');

    if (!quizCard || !progressBar || !progressLabel || !resultDiv) return;

    let questions = [];
    let currentQ = 0;
    let score = 0;
    let answered = false;

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function startQuiz() {
        questions = shuffle(QUIZ_QUESTIONS);
        currentQ = 0;
        score = 0;
        resultDiv.hidden = true;
        showQuestion();
    }

    function showQuestion() {
        answered = false;
        const q = questions[currentQ];
        const pct = Math.round((currentQ / questions.length) * 100);

        progressBar.style.width = `${pct}%`;
        progressBar.setAttribute('aria-valuenow', pct);
        progressBar.setAttribute('aria-valuetext', `Pergunta ${currentQ + 1} de ${questions.length}`);
        progressLabel.textContent = `Pergunta ${currentQ + 1} de ${questions.length}`;

        const letters = ['A', 'B', 'C', 'D'];

        quizCard.innerHTML = `
      <p class="quiz-question-text">${q.question}</p>
      <ul class="quiz-options" role="list">
        ${q.options.map((opt, i) => `
          <li>
            <button
              class="quiz-option-btn"
              data-index="${i}"
              aria-label="Alternativa ${letters[i]}: ${opt}"
            >
              <span class="option-letter" aria-hidden="true">${letters[i]}</span>
              ${opt}
            </button>
          </li>
        `).join('')}
      </ul>
    `;

        // Registrar cliques nas alternativas
        quizCard.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', () => handleAnswer(Number(btn.dataset.index)));
        });
    }

    function handleAnswer(selectedIndex) {
        if (answered) return; // Garante que a pontuação não seja calculada mais de uma vez (especificação)
        answered = true;

        const q = questions[currentQ];
        const isCorrect = selectedIndex === q.correct;
        if (isCorrect) score++;

        // Desabilitar todas as opções e indicar visualmente acerto / erro
        quizCard.querySelectorAll('.quiz-option-btn').forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add('correct');
            if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
        });

        // Exibir feedback educativo imediato
        const feedbackEl = document.createElement('div');
        feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedbackEl.innerHTML = `
      <strong>${isCorrect ? '✅ Resposta correta!' : '❌ Resposta incorreta.'}</strong>
      ${!isCorrect ? `A resposta certa é: <strong>${q.options[q.correct]}</strong><br>` : ''}
      <p style="margin-top:0.4rem;">${q.explanation}</p>
    `;
        feedbackEl.setAttribute('aria-live', 'assertive');
        quizCard.appendChild(feedbackEl);

        // Botão para avançar à próxima pergunta ou ver resultado final
        const nextBtn = document.createElement('button');
        nextBtn.className = 'sim-btn primary quiz-next-btn';
        nextBtn.textContent = currentQ + 1 < questions.length ? 'Próxima Pergunta ▶' : 'Ver Resultado Final 🏆';
        quizCard.appendChild(nextBtn);
        nextBtn.focus();

        nextBtn.addEventListener('click', () => {
            currentQ++;
            if (currentQ < questions.length) {
                showQuestion();
            } else {
                showResult();
            }
        });
    }

    function showResult() {
        quizCard.innerHTML = '';

        progressBar.style.width = '100%';
        progressBar.setAttribute('aria-valuenow', 100);
        progressLabel.textContent = `Quiz concluído — ${questions.length} de ${questions.length}`;

        const pct = Math.round((score / questions.length) * 100);
        let msg;
        if (pct === 100) {
            msg = 'Excelente! Você demonstrou domínio completo sobre o ciclo lunar! 🌕✨';
        } else if (pct >= 80) {
            msg = 'Muito bem! Você tem um ótimo conhecimento sobre a astronomia lunar! 🌖';
        } else if (pct >= 60) {
            msg = 'Bom resultado! Uma rápida revisão no Explorador Lunar vai te deixar fera! 🌗';
        } else {
            msg = 'Continue praticando! Explore as fases no módulo Explorador e tente novamente! 🌑';
        }

        resultScore.textContent = `${score} / ${questions.length} (${pct}%)`;
        resultMsg.textContent = msg;
        resultDiv.hidden = false;
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (btnStartQuiz) {
        btnStartQuiz.addEventListener('click', startQuiz);
    }

    if (btnRestartQuiz) {
        btnRestartQuiz.addEventListener('click', () => {
            resultDiv.hidden = true;
            quizCard.innerHTML = `
        <div id="quiz-start-screen">
          <div class="quiz-moon-deco" aria-hidden="true">🌕</div>
          <h3 class="quiz-start-title">Pronto para tentar novamente?</h3>
          <p class="quiz-start-text">As 10 perguntas serão reembaralhadas. Boa sorte no seu aprendizado!</p>
          <button id="quiz-btn-start" class="sim-btn primary quiz-start-btn">Iniciar Quiz</button>
        </div>
      `;
            const newStartBtn = document.getElementById('quiz-btn-start');
            if (newStartBtn) newStartBtn.addEventListener('click', startQuiz);
            progressBar.style.width = '0%';
            progressLabel.textContent = 'Pergunta 0 de 0';
        });
    }
}

/* ============================================================
   6. INICIALIZAÇÃO
   ============================================================ */
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initStars();
        initTabs();
        initExplorer();
        initSimulator();
        initQuiz();
    });
}

/* ============================================================
   7. EXPORTAÇÃO PARA TESTES AUTOMATIZADOS (NODE.JS)
   ============================================================ */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LUNAR_PHASES,
        SYNODIC_PERIOD,
        dayToPhaseIndex,
        QUIZ_QUESTIONS,
    };
}
