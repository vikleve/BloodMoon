/**
 * LUNAR EXPLORER — script.js
 * Responsabilidades:
 *  1. Canvas de estrelas animado
 *  2. Navegação por abas (Explorador / Simulador / Quiz)
 *  3. Módulo 1 — Explorador Lunar (RF01-RF04)
 *  4. Módulo 2 — Simulador do Ciclo Lunar (RF05-RF08)
 *  5. Módulo 3 — Quiz Lunar (RF09-RF12)
 */

'use strict';

/* ============================================================
   0. DADOS: FASES LUNARES
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
        name: 'Crescente Inicial',
        illumination: '~10%',
        cycleDay: '~Dia 3–4',
        cssClass: 'moon-phase-1',
        description:
            'Poucos dias após a Lua Nova, uma fina faixa iluminada aparece à direita (no hemisfério sul, à esquerda). A porção crescente indica que a Lua está se afastando do alinhamento com o Sol, revelando gradualmente a face iluminada.',
    },
    {
        id: 2,
        name: 'Quarto Crescente',
        illumination: '~50%',
        cycleDay: '~Dia 7',
        cssClass: 'moon-phase-2',
        description:
            'No Quarto Crescente, metade da face lunar visível está iluminada — a metade direita (hemisfério norte). A Lua forma um ângulo de aproximadamente 90° com o Sol em relação à Terra. É uma das quatro fases principais do ciclo.',
    },
    {
        id: 3,
        name: 'Gibosa Crescente',
        illumination: '~80%',
        cycleDay: '~Dia 10–11',
        cssClass: 'moon-phase-3',
        description:
            'A Gibosa Crescente exibe mais da metade da face iluminada. O termo "gibosa" vem do latim gibbus, que significa corcunda ou abaulada. A Lua aparece como um disco quase completo, mas ainda não atingiu a Lua Cheia.',
    },
    {
        id: 4,
        name: 'Lua Cheia',
        illumination: '~100%',
        cycleDay: '~Dia 14–15',
        cssClass: 'moon-phase-4',
        description:
            'Na Lua Cheia, a Terra está entre a Lua e o Sol. Toda a face voltada para a Terra recebe luz solar, tornando a Lua completamente visível e brilhante. É a fase de maior iluminação e ocorre aproximadamente na metade do ciclo.',
    },
    {
        id: 5,
        name: 'Gibosa Minguante',
        illumination: '~80%',
        cycleDay: '~Dia 18–19',
        cssClass: 'moon-phase-5',
        description:
            'Após a Lua Cheia, a porção iluminada começa a diminuir pelo lado esquerdo (hemisfério norte). A Gibosa Minguante ainda exibe uma grande área iluminada, mas a tendência é de redução progressiva até o Quarto Minguante.',
    },
    {
        id: 6,
        name: 'Quarto Minguante',
        illumination: '~50%',
        cycleDay: '~Dia 22',
        cssClass: 'moon-phase-6',
        description:
            'No Quarto Minguante, a metade esquerda da Lua está iluminada (hemisfério norte). Assim como o Quarto Crescente, forma um ângulo de 90° com o Sol, mas agora a Lua está na fase decrescente. É a última fase principal antes da Lua Nova.',
    },
    {
        id: 7,
        name: 'Minguante Final',
        illumination: '~10%',
        cycleDay: '~Dia 25–27',
        cssClass: 'moon-phase-7',
        description:
            'Na Minguante Final, apenas uma fina faixa iluminada permanece à esquerda (hemisfério norte). A Lua está se aproximando do alinhamento com o Sol, encerrando o ciclo sinódico antes de uma nova Lua Nova.',
    },
];

/* Duração do ciclo sinódico em dias astronômicos */
const SYNODIC_PERIOD = 29.53;

/**
 * Retorna o índice da fase correspondente a um dia do ciclo (0..29.53)
 * Fases: 0-3.68 | 3.68-7.37 | 7.37-11.05 | 11.05-14.73 |
 *        14.73-18.42 | 18.42-22.10 | 22.10-25.79 | 25.79-29.53
 */
function dayToPhaseIndex(day) {
    const segment = SYNODIC_PERIOD / 8;
    return Math.min(Math.floor(day / segment), 7);
}

/* ============================================================
   1. CANVAS DE ESTRELAS
   ============================================================ */
function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let stars = [];

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
            ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(2)})`;
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
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
            // Navegação por teclado entre abas (left/right arrows)
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

    // Gerar cartões da grade
    LUNAR_PHASES.forEach((phase, i) => {
        const card = document.createElement('button');
        card.className = 'phase-card';
        card.role = 'listitem';
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

        // Clique seleciona a fase
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

        // Atualizar textos
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

    // Estado da simulação
    let running = false;
    let rafId = null;
    let lastTimestamp = null;
    let currentDay = 0;          // dia astronômico atual (0..29.53)
    let speedFactor = 1;          // multiplicador de velocidade

    /**
     * Velocidade base: o ciclo completo dura CYCLE_REAL_MS milissegundos reais
     * a 1× de velocidade. Aqui usamos 29.53 segundos reais por cada dia lunar,
     * ou seja, o ciclo dura ≈ 14 minutos a 1×.
     * speedFactor acelera linearmente esse tempo.
     */
    const MS_PER_LUNAR_DAY_AT_1X = 29_530; // 29.53 s reais = 1 dia lunar a 1×

    function updateUI(day) {
        const phaseIdx = dayToPhaseIndex(day);
        const phase = LUNAR_PHASES[phaseIdx];
        const pct = (day / SYNODIC_PERIOD) * 100;

        simMoon.className = `moon sim-moon ${phase.cssClass}`;
        simMoon.setAttribute('aria-label', `Simulador — ${phase.name}`);
        simDay.textContent = day.toFixed(1);
        simPhLabel.textContent = phase.name;
        simPhName.textContent = phase.name;

        const pctRounded = Math.min(Math.round(pct), 100);
        simProgress.style.width = `${pctRounded}%`;
        simProgress.setAttribute('aria-valuenow', pctRounded);
        simPct.textContent = pctRounded;
    }

    function tick(timestamp) {
        if (!running) return;

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const elapsed = timestamp - lastTimestamp; // ms desde último frame
        lastTimestamp = timestamp;

        // Avançar dias proporcionalmente ao tempo real e à velocidade
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
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
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

/** Banco de perguntas (≥8 questões) */
const QUIZ_QUESTIONS = [
    {
        question: 'Qual é a duração aproximada do ciclo lunar completo (de uma Lua Nova à próxima)?',
        options: ['27,3 dias', '29,53 dias', '30 dias', '24 horas'],
        correct: 1,
        explanation:
            'O ciclo sinódico da Lua — de uma Lua Nova à próxima — tem duração de aproximadamente 29,53 dias. O período de 27,3 dias é o ciclo sidéreo, contado em relação às estrelas distantes.',
    },
    {
        question: 'O que causa as fases da Lua?',
        options: [
            'A sombra da Terra projetada sobre a Lua',
            'A rotação da Lua em torno de seu próprio eixo',
            'A mudança da porção iluminada pelo Sol que vemos da Terra',
            'A variação da distância entre a Terra e a Lua',
        ],
        correct: 2,
        explanation:
            'As fases são causadas pela mudança do ângulo entre Sol, Terra e Lua. Conforme a Lua orbita a Terra, vemos porções diferentes de sua face iluminada pelo Sol — não é a sombra terrestre.',
    },
    {
        question: 'Na Lua Nova, qual é o percentual aproximado de iluminação visível da Terra?',
        options: ['50%', '25%', '0%', '100%'],
        correct: 2,
        explanation:
            'Na Lua Nova, a Lua está posicionada entre a Terra e o Sol. O lado voltado para nós está completamente na sombra, tornando a iluminação visível praticamente 0%.',
    },
    {
        question: 'Qual fase ocorre aproximadamente no Dia 7 do ciclo lunar?',
        options: ['Lua Cheia', 'Quarto Crescente', 'Gibosa Crescente', 'Crescente Inicial'],
        correct: 1,
        explanation:
            'O Quarto Crescente ocorre por volta do sétimo dia do ciclo. Nessa fase, metade da face lunar visível está iluminada — o hemisfério direito, no hemisfério norte.',
    },
    {
        question: 'Qual é a principal diferença entre uma fase crescente e uma fase minguante?',
        options: [
            'Nas crescentes a Lua fica mais próxima da Terra',
            'Nas crescentes a iluminação visível aumenta; nas minguantes, diminui',
            'Nas minguantes a Lua fica mais brilhante',
            'Nas crescentes a Lua nasce à meia-noite',
        ],
        correct: 1,
        explanation:
            'As fases crescentes (Lua Nova → Lua Cheia) mostram iluminação crescente. As fases minguantes (Lua Cheia → Lua Nova) mostram iluminação decrescente, à medida que a porção iluminada visível diminui.',
    },
    {
        question: 'Em qual configuração geométrica ocorre a Lua Cheia?',
        options: [
            'A Lua está entre a Terra e o Sol',
            'A Terra está entre a Lua e o Sol',
            'O Sol está entre a Terra e a Lua',
            'A Lua está perpendicular ao eixo Terra-Sol',
        ],
        correct: 1,
        explanation:
            'Na Lua Cheia, a Terra se posiciona entre a Lua e o Sol, de modo que toda a face lunar voltada para a Terra recebe luz solar direta, resultando em iluminação de quase 100%.',
    },
    {
        question: 'Em qual fase a Lua está totalmente visível e iluminada?',
        options: ['Quarto Crescente', 'Gibosa Crescente', 'Lua Nova', 'Lua Cheia'],
        correct: 3,
        explanation:
            'A Lua Cheia é a fase em que a face voltada para a Terra recebe luz solar diretamente, tornando-a completamente visível e brilhante no céu noturno.',
    },
    {
        question: 'Quantas são as fases lunares principais tradicionais reconhecidas em astronomia?',
        options: ['2', '4', '6', '8'],
        correct: 1,
        explanation:
            'As quatro fases principais são: Lua Nova, Quarto Crescente, Lua Cheia e Quarto Minguante. As outras quatro fases do ciclo (Crescente Inicial, Gibosa Crescente, Gibosa Minguante e Minguante Final) são intermediárias.',
    },
    {
        question: 'A Lua produz luz própria?',
        options: [
            'Sim, como as estrelas',
            'Somente durante a Lua Cheia',
            'Não; ela reflete a luz do Sol',
            'Não; ela absorve e irradia calor',
        ],
        correct: 2,
        explanation:
            'A Lua não é uma fonte de luz própria. Ela reflete a luz que recebe do Sol. A quantidade dessa reflexão que vemos da Terra varia ao longo do ciclo lunar, dando origem às diferentes fases.',
    },
    {
        question: 'Qual fase segue imediatamente após o Quarto Minguante, encerrando o ciclo?',
        options: ['Gibosa Minguante', 'Crescente Inicial', 'Minguante Final', 'Lua Cheia'],
        correct: 2,
        explanation:
            'O Quarto Minguante ocorre no ~Dia 22. A Minguante Final (também chamada de Crescente Minguante ou Balsâmica) sucede essa fase, chegando até o próximo ciclo com a Lua Nova.',
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
        progressLabel.textContent = `Pergunta ${currentQ + 1} de ${questions.length}`;

        // Letras A-D
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
        if (answered) return; // impede dupla resposta (RF10)
        answered = true;

        const q = questions[currentQ];
        const isCorrect = selectedIndex === q.correct;
        if (isCorrect) score++;

        // Marcar alternativas (RF10 — feedback imediato)
        quizCard.querySelectorAll('.quiz-option-btn').forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add('correct');
            if (i === selectedIndex && !isCorrect) btn.classList.add('wrong');
        });

        // Exibir feedback e explicação
        const feedbackEl = document.createElement('div');
        feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedbackEl.innerHTML = `
      <strong>${isCorrect ? '✅ Correto!' : '❌ Incorreto.'}</strong>
      ${!isCorrect ? `A resposta correta é: <strong>${q.options[q.correct]}</strong><br>` : ''}
      ${q.explanation}
    `;
        feedbackEl.setAttribute('aria-live', 'assertive');
        quizCard.appendChild(feedbackEl);

        // Botão de avançar para próxima pergunta
        const nextBtn = document.createElement('button');
        nextBtn.className = 'sim-btn primary quiz-next-btn';
        nextBtn.textContent = currentQ + 1 < questions.length ? 'Próxima ▶' : 'Ver Resultado';
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

        // Barra de progresso completa
        progressBar.style.width = '100%';
        progressBar.setAttribute('aria-valuenow', 100);
        progressLabel.textContent = `Quiz concluído — ${questions.length} de ${questions.length}`;

        const pct = Math.round((score / questions.length) * 100);
        let msg;
        if (pct === 100) msg = 'Excelente! Você acertou todas as questões! 🌕';
        else if (pct >= 70) msg = 'Muito bem! Você tem um ótimo conhecimento lunar! 🌖';
        else if (pct >= 50) msg = 'Bom resultado! Continue estudando para melhorar! 🌗';
        else msg = 'Continue praticando — as fases da Lua são fascinantes! 🌑';

        resultScore.textContent = `${score} / ${questions.length} (${pct}%)`;
        resultMsg.textContent = msg;
        resultDiv.hidden = false;
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Botão inicial da tela de quiz
    if (btnStartQuiz) {
        btnStartQuiz.addEventListener('click', startQuiz);
    }

    // Reiniciar quiz
    if (btnRestartQuiz) {
        btnRestartQuiz.addEventListener('click', () => {
            resultDiv.hidden = true;
            quizCard.innerHTML = `
        <div id="quiz-start-screen">
          <div class="quiz-moon-deco" aria-hidden="true">🌕</div>
          <h2 class="quiz-start-title">Pronto para tentar novamente?</h2>
          <p class="quiz-start-text">As perguntas serão embaralhadas. Boa sorte!</p>
          <button id="quiz-btn-start" class="sim-btn primary quiz-start-btn">Iniciar Quiz</button>
        </div>
      `;
            document.getElementById('quiz-btn-start').addEventListener('click', startQuiz);
            progressBar.style.width = '0%';
            progressLabel.textContent = 'Pergunta 0 de 0';
        });
    }
}

/* ============================================================
   6. INICIALIZAÇÃO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initTabs();
    initExplorer();
    initSimulator();
    initQuiz();
});
