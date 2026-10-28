$dir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not (Test-Path "$dir\index.html")) { $dir = '.' }
$html = Get-Content "$dir\index.html" -Raw
$css  = Get-Content "$dir\style.css"  -Raw
$js   = Get-Content "$dir\script.js"  -Raw


$results = [System.Collections.Generic.List[PSCustomObject]]::new()

function Add-Test($name, $pass) {
    $results.Add([PSCustomObject]@{ Test=$name; Result=if($pass){'PASS'}else{'FAIL'} })
}

# T01 - Links CSS e JS
Add-Test 'T01 - Link style.css no HTML'   ($html -match 'href="style\.css"')
Add-Test 'T01 - Link script.js no HTML'   ($html -match 'src="script\.js"')

# T02 - Três abas
Add-Test 'T02 - Aba Explorador'  ($html -match 'data-tab="explorer"')
Add-Test 'T02 - Aba Simulador'   ($html -match 'data-tab="simulator"')
Add-Test 'T02 - Aba Quiz'        ($html -match 'data-tab="quiz"')

# T03 - 8 fases no JS
$phaseCount = ([regex]::Matches($js, '"name":')).Count
if ($phaseCount -eq 0) { $phaseCount = ([regex]::Matches($js, 'name:')).Count }
Add-Test "T03 - 8 fases lunares (encontradas: $phaseCount)" ($phaseCount -ge 8)

# T04 - Funções JS essenciais
foreach ($fn in @('initStars','initTabs','initExplorer','initSimulator','initQuiz','dayToPhaseIndex','requestAnimationFrame')) {
    Add-Test "T04 - Funcao: $fn" ($js -match $fn)
}

# T05 - Atributos ARIA
foreach ($a in @('aria-label','aria-selected','aria-controls','aria-live','role="tablist"','role="tabpanel"')) {
    Add-Test "T05 - ARIA: $a" ($html -match [regex]::Escape($a))
}

# T06 - Questões do quiz
$qCount = ([regex]::Matches($js, 'question:')).Count
Add-Test "T06 - Questoes quiz >=8 (encontradas: $qCount)" ($qCount -ge 8)

# T07 - Navegação circular
Add-Test 'T07 - Navegacao circular (LUNAR_PHASES.length)' ($js -match 'LUNAR_PHASES\.length')

# T08 - Controles simulador no HTML
foreach ($c in @('sim-btn-start','sim-btn-pause','sim-btn-reset')) {
    Add-Test "T08 - Controle: $c" ($html -match $c)
}

# T09 - Media queries
$mqCount = ([regex]::Matches($css, '@media')).Count
Add-Test "T09 - Media queries CSS (encontradas: $mqCount)" ($mqCount -ge 4)

# T10 - Classes CSS fases 0-7
$classesFound = (0..7 | Where-Object { $css -match "\.moon-phase-$_" }).Count
Add-Test "T10 - Classes CSS moon-phase-0 a 7 (encontradas: $classesFound)" ($classesFound -eq 8)

# T11 - Sem src externo em imagens
Add-Test 'T11 - Sem imagens externas (src=http)' (-not ($html -match 'src="http'))

# T12 - Arquivos existem
foreach ($f in @('index.html','style.css','script.js','README.md')) {
    Add-Test "T12 - Arquivo existe: $f" (Test-Path "$dir\$f")
}

# Relatório
Write-Host ''
Write-Host '===== RELATORIO DE TESTES ESTATICOS — LUNAR EXPLORER ====='
$pass = ($results | Where-Object { $_.Result -eq 'PASS' }).Count
$fail = ($results | Where-Object { $_.Result -eq 'FAIL' }).Count
$results | Format-Table -AutoSize
Write-Host "TOTAL: $($results.Count)  |  PASS: $pass  |  FAIL: $fail"
Write-Host '==========================================================='
