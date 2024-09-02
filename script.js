let jogadorAtual = 'X';
let pontuacoes = { X: 0, O: 0 };
const nomesJogadores = {};
let jogadas = 0;
let placarGeral = JSON.parse(localStorage.getItem('placarGeral')) || {};

function pedirNomesJogadores() {
    nomesJogadores.X = prompt("Digite o nome do jogador X:") || 'X';
    nomesJogadores.O = prompt("Digite o nome do jogador O:") || 'O';
    atualizarPlacar();
    mostrarMensagem(`Vez do jogador ${nomesJogadores[jogadorAtual]}`, 'vezX');
}

function marcarCelula(celula) {
    if (celula.textContent) return;

    celula.textContent = jogadorAtual;
    jogadas++;

    if (verificarVencedor()) {
        pontuacoes[jogadorAtual]++;
        atualizarPlacar();
        atualizarPlacarGeral(nomesJogadores[jogadorAtual]);
        mostrarMensagem(`${nomesJogadores[jogadorAtual]} venceu e ganhou um ponto!`, 'vitoria');
        setTimeout(() => {
            resetarTabuleiro();
            mostrarMensagem(`Vez do jogador ${nomesJogadores[jogadorAtual]}`, `vez${jogadorAtual}`);
        }, 2000);
        jogadas = 0;
    } else if (verificarEmpate()) {
        mostrarMensagem("Empate!", 'empate');
        setTimeout(() => {
            resetarTabuleiro();
            mostrarMensagem(`Vez do jogador ${nomesJogadores[jogadorAtual]}`, `vez${jogadorAtual}`);
        }, 2000);
        jogadas = 0;
    } else {
        if (jogadas === 4) {
            embaralharTabuleiro();
        }
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
        const tipoMensagem = jogadorAtual === 'X' ? 'vezX' : 'vezO';
        mostrarMensagem(`Vez do jogador ${nomesJogadores[jogadorAtual]}`, tipoMensagem);
    }
}

function verificarVencedor() {
    const celulas = document.querySelectorAll(`#tabuleiro1 .celula`);
    const combinacoesVencedoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of combinacoesVencedoras) {
        if (celulas[a].textContent && celulas[a].textContent === celulas[b].textContent && celulas[a].textContent === celulas[c].textContent) {
            return true;
        }
    }
    return false;
}

function verificarEmpate() {
    return Array.from(document.querySelectorAll(`#tabuleiro1 .celula`)).every(celula => celula.textContent);
}

function resetarTabuleiro() {
    document.querySelectorAll(`#tabuleiro1 .celula`).forEach(celula => celula.textContent = '');
}

function atualizarPlacar() {
    document.getElementById('pontuacao').textContent = `${nomesJogadores.X || 'X'}: ${pontuacoes.X} | ${nomesJogadores.O || 'O'}: ${pontuacoes.O}`;
}

function atualizarPlacarGeral(jogador) {
    if (!placarGeral[jogador]) {
        placarGeral[jogador] = 0;
    }
    placarGeral[jogador]++;
    localStorage.setItem('placarGeral', JSON.stringify(placarGeral));
    exibirPlacarGeral();
}

function exibirPlacarGeral() {
    const placarGeralDiv = document.getElementById('placarGeral');
    placarGeralDiv.innerHTML = '';
    for (const jogador in placarGeral) {
        const li = document.createElement('li');
        li.textContent = `${jogador}: ${placarGeral[jogador]} vitórias`;
        placarGeralDiv.appendChild(li);
    }
}

function mostrarMensagem(texto, tipo = '') {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = texto;
    mensagemDiv.className = `mensagem ${tipo}`;
}

function embaralharTabuleiro() {
    const celulas = Array.from(document.querySelectorAll(`#tabuleiro1 .celula`));
    const valores = celulas.map(celula => celula.textContent);

    for (let i = valores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [valores[i], valores[j]] = [valores[j], valores[i]];
    }

    celulas.forEach((celula, i) => {
        celula.textContent = valores[i];
    });
}

pedirNomesJogadores();
exibirPlacarGeral();
