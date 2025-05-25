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



});
