document.addEventListener("DOMContentLoaded", () => {
    const VIDA_MAXIMA = 100;
    let vidaGorila = VIDA_MAXIMA;
    let humanos = Array.from({ length: 100 }, () => ({ vivo: true })); 
    let ataquesFeitos = 0;
    let reducaoDano = 0;
    let jogoEncerrado = false;
    let emAcao = false; 
  

    const displayVida = document.getElementById("vida-gorila");
    const displayHumanos = document.getElementById("humanos-restantes");
    const logBatalha = document.getElementById("log-texto");
    const botoes = document.querySelectorAll("#actions button");
    const btnReiniciar = document.getElementById("btn-reiniciar");
    const restartSection = document.getElementById("restart-section");
  

    const imgGorila = document.getElementById("imagem-gorila");
    const imgSoco = document.getElementById("imagem-gorila-soco");
    const imgDefendendo = document.getElementById("imagem-gorila-defendendo");
    const imgCurando = document.getElementById("imagem-gorila-curando");
  

    const somCura = new Audio("assets/audio/cura.wav");
    const somDefesa = new Audio("assets/audio/defesa.ogg");
    const somSoco = new Audio("assets/audio/soco.wav");

    function salvarEstadoJogo() {
        const estadoJogo = {
            vidaGorila,
            humanos,
            ataquesFeitos,
            reducaoDano,
            jogoEncerrado,
            emAcao,
            logBatalha: logBatalha.innerHTML
        };
        localStorage.setItem('gorilaVsHumanos', JSON.stringify(estadoJogo));
        console.log('Estado do jogo salvo:', estadoJogo);
    }

    function carregarEstadoJogo() {
        const estadoSalvo = localStorage.getItem('gorilaVsHumanos');
        console.log('Estado salvo encontrado:', estadoSalvo);
        
        if (estadoSalvo) {
            const estado = JSON.parse(estadoSalvo);
            vidaGorila = estado.vidaGorila;
            humanos = estado.humanos;
            ataquesFeitos = estado.ataquesFeitos;
            reducaoDano = estado.reducaoDano;
            jogoEncerrado = estado.jogoEncerrado;
            emAcao = false; 
            logBatalha.innerHTML = estado.logBatalha;

            atualizarStatus();
            
            if (jogoEncerrado) {
                toggleBotoes(true);
                restartSection.classList.remove("hidden");
            } else {
                toggleBotoes(false); 
            }

      
            if (jogoEncerrado) {
                if (vidaGorila <= 0) {
                    trocarImagem(document.getElementById("imagem-gorila-derrota"));
                } else {
                    trocarImagem(document.getElementById("imagem-gorila-vitoria"));
                }
            } else {
                trocarImagem(imgGorila);
            }

            console.log('Estado do jogo carregado:', estado); 
        }
    }

    function limparEstadoSalvo() {
        localStorage.removeItem('gorilaVsHumanos');
        console.log('Estado do jogo limpo');
    }

    function salvarAposAcao() {
        salvarEstadoJogo();
    }

    function reiniciarJogo() {
        vidaGorila = VIDA_MAXIMA;
        humanos = Array.from({ length: 100 }, () => ({ vivo: true }));
        ataquesFeitos = 0;
        reducaoDano = 0;
        jogoEncerrado = false;
        emAcao = false;

        logBatalha.innerHTML = "";

        const todasImagens = document.querySelectorAll(".gorila");
        todasImagens.forEach((img) => {
            img.style.display = "none";
            img.classList.remove("ativo");
        });
        const imgGorilaNormal = document.getElementById("imagem-gorila");
        imgGorilaNormal.style.display = "block";
        imgGorilaNormal.classList.add("ativo");

        atualizarStatus();
        toggleBotoes(false);
        restartSection.classList.add("hidden");

        adicionarLog("🔄 Jogo reiniciado! A batalha recomeça!");
    }

    function atualizarStatus() {
        displayVida.textContent = vidaGorila;
        displayHumanos.textContent = humanos.filter((h) => h.vivo).length;
        verificarFimDeJogo();
    }

    function adicionarLog(msg) {
        logBatalha.innerHTML += `<p>${msg}</p>`;
        logBatalha.scrollTop = logBatalha.scrollHeight;
    }

    
    function trocarImagem(ativa) {
    const todasImagens = document.querySelectorAll(".gorila");
    todasImagens.forEach((img) => {
        img.style.display = "none";
        img.classList.remove("ativo");
    });
    ativa.style.display = "block";
    ativa.classList.add("ativo");
    }


    function toggleBotoes(desabilitar) {
    botoes.forEach((botao) => {
        botao.disabled = desabilitar;
        if (desabilitar) {
            botao.classList.add("desabilitado");
        } else {
            botao.classList.remove("desabilitado");
        }
    });
    }

    // Função de ataque do gorila
    function atacar() {
        if (jogoEncerrado || emAcao) return;

        emAcao = true;
        toggleBotoes(true);

        somSoco.play();
        trocarImagem(imgSoco);

        const quantidadeEliminados = Math.floor(Math.random() * 6) + 3;
        let eliminados = 0;
        for (let humano of humanos) {
            if (eliminados >= quantidadeEliminados) break;
            if (humano.vivo) {
                humano.vivo = false;
                eliminados++;
            }
        }
        ataquesFeitos++;
        adicionarLog(`🦍 Gorila atacou e eliminou ${eliminados} humano(s)!`);
        atualizarStatus();

        setTimeout(() => {
            if (!jogoEncerrado) {
                trocarImagem(imgGorila);
            }
            humanosAtacam();
        }, 1000);
    }

    // Função de defesa do gorila
    function defender() {
        if (jogoEncerrado || emAcao) return;

        emAcao = true;
        toggleBotoes(true);

        somDefesa.play();
        trocarImagem(imgDefendendo);

        reducaoDano = Math.floor(Math.random() * 6) + 2;
        adicionarLog(`🛡️ Gorila reduzirá ${reducaoDano} de dano no próximo ataque.`);
        atualizarStatus();

        setTimeout(() => {
            if (!jogoEncerrado) {
                trocarImagem(imgGorila);
            }
            humanosAtacam();
        }, 1000);
    }

    // Função de cura do gorila
    function curar() {
        if (jogoEncerrado || emAcao) return;

        emAcao = true;
        toggleBotoes(true);

        somCura.play();
        trocarImagem(imgCurando);

        const cura = Math.floor(Math.random() * 8) + 5;
        const vidaAntes = vidaGorila;
        vidaGorila = Math.min(VIDA_MAXIMA, vidaGorila + cura);
        const recuperado = vidaGorila - vidaAntes;
        adicionarLog(`❤️ Gorila se curou e recuperou ${recuperado} de vida.`);
        atualizarStatus();

        setTimeout(() => {
            if (!jogoEncerrado) {
                trocarImagem(imgGorila);
            }
            humanosAtacam();
        }, 1000);
    }

    function humanosAtacam() {
    if (jogoEncerrado) return;

    const vivos = humanos.filter((h) => h.vivo);
    if (vivos.length === 0 || vidaGorila <= 0) {
        emAcao = false;
        toggleBotoes(false);
        return;
    }

    let danoTotal = 0;
    const chanceAtaque = Math.min(0.08, vivos.length * 0.008);

    for (let h of vivos) {
        if (Math.random() < chanceAtaque) {
            danoTotal += Math.floor(Math.random() * 2) + 1;
        }
    }

    danoTotal = Math.min(danoTotal, 13);
    const danoFinal = Math.max(0, danoTotal - reducaoDano);
    vidaGorila = Math.max(0, vidaGorila - danoFinal);

    if (danoTotal > 0) {
        adicionarLog(`⚔️ Humanos causaram ${danoTotal} de dano total.`);
        if (reducaoDano > 0) {
            adicionarLog(`🛡️ Defesa reduziu ${reducaoDano} de dano.`);
            adicionarLog(`💥 Gorila sofreu ${danoFinal} de dano.`);
        }
    }

    reducaoDano = 0;
    atualizarStatus();

    setTimeout(() => {
        emAcao = false;
        toggleBotoes(false);
    }, 1000);
    }

    function verificarFimDeJogo() {
    const humanosVivos = humanos.filter((h) => h.vivo).length;

    if (!jogoEncerrado) {
        if (vidaGorila <= 0) {
            jogoEncerrado = true;
            emAcao = true;
            toggleBotoes(true);
            trocarImagem(document.getElementById("imagem-gorila-derrota"));
            adicionarLog("💀 Gorila derrotado! Fim do jogo.");
            restartSection.classList.remove("hidden");
        } else if (humanosVivos === 0) {
            jogoEncerrado = true;
            emAcao = true;
            toggleBotoes(true);
            trocarImagem(document.getElementById("imagem-gorila-vitoria"));
            adicionarLog("🏆 Todos os humanos foram eliminados! O gorila venceu.");
            restartSection.classList.remove("hidden");
        }
    }
    }

    document.getElementById("btn-atacar").addEventListener("click", atacar);
    document.getElementById("btn-defender").addEventListener("click", defender);
    document.getElementById("btn-curar").addEventListener("click", curar);
    btnReiniciar.addEventListener("click", reiniciarJogo);

    atualizarStatus();

});
