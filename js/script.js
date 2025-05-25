// JavaScript estruturado com classe .ativo para imagens do gorila

// Inicialização do jogo quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {
    // Constantes e variáveis globais do jogo
    const VIDA_MAXIMA = 100;
    let vidaGorila = VIDA_MAXIMA;
    let humanos = Array.from({ length: 100 }, () => ({ vivo: true })); // Array de objetos representando os humanos
    let ataquesFeitos = 0;
    let reducaoDano = 0;
    let jogoEncerrado = false;
    let emAcao = false; // Controla se o gorila está realizando uma ação
  
    // Elementos do DOM
    const displayVida = document.getElementById("vida-gorila");
    const displayHumanos = document.getElementById("humanos-restantes");
    const logBatalha = document.getElementById("log-texto");
    const botoes = document.querySelectorAll("#actions button");
    const btnReiniciar = document.getElementById("btn-reiniciar");
    const restartSection = document.getElementById("restart-section");
  
    // Imagens do gorila para diferentes estados
    const imgGorila = document.getElementById("imagem-gorila");
    const imgSoco = document.getElementById("imagem-gorila-soco");
    const imgDefendendo = document.getElementById("imagem-gorila-defendendo");
    const imgCurando = document.getElementById("imagem-gorila-curando");
  
    // Efeitos sonoros
    const somCura = new Audio("assets/audio/cura.wav");
    const somDefesa = new Audio("assets/audio/defesa.ogg");
    const somSoco = new Audio("assets/audio/soco.wav");