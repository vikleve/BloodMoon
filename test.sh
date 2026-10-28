#!/usr/bin/env bash
# Script para executar a suíte de testes automatizados do BloodMoon — Lunar Explorer
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "Executando suíte de testes automatizados..."
node test.js
