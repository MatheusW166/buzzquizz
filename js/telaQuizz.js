let ULTIMA_POSICAO_SCROLL = 0;

const STATES = {
  respondida: "respondida",
  marcada: "marcada",
  correta: "correta",
  errada: "errada",
};

const STATUS_JOGADOR = {
  respondidas: 0,
  acertos: 0,
  quizzAtual: null,
};

const DELAY_SCROLL = 2 * 1000;

function tagImgCustomizada({
  src,
  classes = "",
  alt = "Imagem não encontrada",
}) {
  const errorImg =
    "https://img.freepik.com/vetores-gratis/ilustracao-do-conceito-de-erro-404_114360-1811.jpg?w=1380&t=st=1674767020~exp=1674767620~hmac=3086a44998dab9bb1ba874e20630e81a1a9833a05f9e5416776bac916c3fbf91";
  return `
  <img 
    src="${src}"
    class="${classes}"
    alt="${alt}" 
    onerror="this.src='${errorImg}';" 
  />
  `;
}

function resetarStatusJogador(quizz) {
  STATUS_JOGADOR.respondidas = 0;
  STATUS_JOGADOR.acertos = 0;
  STATUS_JOGADOR.quizzAtual = quizz;
}

function scrollTop(behavior) {
  window.scrollTo({ top: 0, behavior: behavior });
}

function scrollPraUltimaPosicao() {
  window.scrollTo({ top: ULTIMA_POSICAO_SCROLL });
}

function resetarRespostas(perguntas) {
  perguntas.forEach((pergunta) => {
    pergunta.classList.remove(STATES.respondida);
    const alternativas = pergunta.querySelectorAll(".alternativa");
    alternativas.forEach((alternativa) => {
      alternativa.classList.remove(STATES.marcada);
    });
  });
}

function removerResultadoeNavegacaoComDelay() {
  setTimeout(() => {
    document.querySelector(".resultado").style.display = "none";
    document.querySelector(".tela.quizz .navegacao-quizz").style.display =
      "none";
  }, 600);
}

window.voltarDoQuizzParaHome = function () {
  document.querySelector(".tela.quizz").style.display = "none";
  document.querySelector(".tela.home").style.display = "flex";
  scrollPraUltimaPosicao();
};

window.reiniciarQuizz = function () {
  const containersPerguntas = document.querySelectorAll(".pergunta");
  resetarRespostas(containersPerguntas);
  resetarStatusJogador(STATUS_JOGADOR.quizzAtual);
  scrollTop("smooth");
  removerResultadoeNavegacaoComDelay();
};

function criarLayoutNavegacaoQuizz() {
  return `
  <div style="display:none" class="navegacao-quizz">
    <button onclick="reiniciarQuizz()" class="reiniciar-btn">Reiniciar Quizz</button>
    <button onclick="voltarDoQuizzParaHome()" class="home-btn">Voltar pra home</button>
  </div>
  `;
}

function criarLayoutResultado() {
  return `
  <article style="display:none" class="resultado">
    <div class="resultado-titulo">
      <h3></h3>
    </div>
    <div class="corpo-resultado">
      ${tagImgCustomizada({ src: "" })}
      <p></p>
    </div>
  </article>
  `;
}

function mostrarNavegacao() {
  document.querySelector(".tela.quizz .navegacao-quizz").style.display = "flex";
}

function mostrarResultado(nivel, percentual) {
  const elementoResultado = document.querySelector(".tela.quizz .resultado");
  const h3 = elementoResultado.querySelector("h3");
  const img = elementoResultado.querySelector("img");
  const p = elementoResultado.querySelector("p");
  const { title, text, image } = nivel;
  h3.innerHTML = `${percentual}% de acerto: ${title}`;
  img.src = image;
  p.innerHTML = text;
  elementoResultado.style.display = "flex";
  return elementoResultado;
}

function scrollarApos2segundos(element) {
  if (!element) {
    return;
  }
  setTimeout(() => {
    const limiteSuperiorScroll =
      element.getBoundingClientRect().top + window.pageYOffset - 150;
    window.scrollTo({ top: limiteSuperiorScroll, behavior: "smooth" });
  }, DELAY_SCROLL);
}

function perguntaRespondida(pergunta) {
  return pergunta.classList.contains(STATES.respondida);
}

function alternativaCerta(alternativa) {
  return alternativa.classList.contains(STATES.correta);
}

function adicionarClasseDePerguntaRespondida(alternativa, containerDaPergunta) {
  alternativa.classList.add(STATES.marcada);
  containerDaPergunta.classList.add(STATES.respondida);
}

function quizzTerminou(quizz) {
  return quizz.questions.length === STATUS_JOGADOR.respondidas;
}

function nivelDoPercentualAcertado(quizz, percentual) {
  return quizz.levels.filter((level) => percentual >= level.minValue).at(-1);
}

function resultadoOuProximaPergunta(containerDaPergunta) {
  const { respondidas, acertos, quizzAtual } = STATUS_JOGADOR;
  if (!quizzTerminou(quizzAtual)) {
    return containerDaPergunta.nextElementSibling;
  }
  const percentual = Math.round((acertos / respondidas) * 100);
  mostrarNavegacao();
  return mostrarResultado(
    nivelDoPercentualAcertado(quizzAtual, percentual),
    percentual
  );
}

window.marcarResposta = (alternativa) => {
  const containerDaPergunta = alternativa.parentElement.parentElement;
  if (perguntaRespondida(containerDaPergunta)) {
    return;
  }
  STATUS_JOGADOR.respondidas++;
  if (alternativaCerta(alternativa)) {
    STATUS_JOGADOR.acertos++;
  }
  adicionarClasseDePerguntaRespondida(alternativa, containerDaPergunta);
  scrollarApos2segundos(resultadoOuProximaPergunta(containerDaPergunta));
};

function criarLayoutAlternativa(alternativa) {
  return `
  <div onclick="marcarResposta(this)" class="alternativa ${
    alternativa.isCorrectAnswer ? STATES.correta : STATES.errada
  }">
    ${tagImgCustomizada({ src: alternativa.image })}
    <p>${alternativa.text}</p>
  </div>
  `;
}

function embaralharAlternativas(alternativas) {
  alternativas.sort(() => Math.random() - 0.5);
}

function criarLayoutDaPergunta(pergunta) {
  embaralharAlternativas(pergunta.answers);
  return `
  <article class="pergunta">
  <div style="background-color:${pergunta.color};" class="pergunta-titulo">
    <h3>${pergunta.title}</h3>
  </div>
  <div class="alternativas">
    ${pergunta.answers.reduce(
      (prev, curr) => prev + criarLayoutAlternativa(curr),
      ""
    )}
  </div>
  </article>
  `;
}

function criarLayoutDasPerguntas(quizz) {
  return quizz.questions.reduce(
    (prev, curr) => prev + criarLayoutDaPergunta(curr),
    ""
  );
}

function criarLayoutTitulo(quizz) {
  return `
  <div class="titulo-container">
    <h2>${quizz.title}</h2>
    <div class="overlay"></div>
    ${tagImgCustomizada({ src: quizz.image })}
  </div>
  `;
}

function criarLayoutDaPagina(quizz) {
  const layout = {
    titulo: criarLayoutTitulo(quizz),
    perguntas: criarLayoutDasPerguntas(quizz),
    resultado: criarLayoutResultado(),
    navegacao: criarLayoutNavegacaoQuizz(),
  };
  return Object.values(layout).reduce((prev, curr) => prev + curr, "");
}

function salvarUltimaPosicaoDoScroll() {
  ULTIMA_POSICAO_SCROLL = window.scrollY;
}

function criarTelaQuizz(quizz) {
  salvarUltimaPosicaoDoScroll();
  resetarStatusJogador(quizz); // Resetando dados do jogo anterior
  const layoutPagina = criarLayoutDaPagina(quizz);
  const telaQuizz = document.querySelector(".tela.quizz");
  telaQuizz.innerHTML = layoutPagina;
  telaQuizz.style.display = "flex";
  scrollTop();
}

export { criarTelaQuizz, tagImgCustomizada };
