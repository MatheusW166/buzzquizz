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

function resetarStatusJogador(quizz) {
  STATUS_JOGADOR.respondidas = 0;
  STATUS_JOGADOR.acertos = 0;
  STATUS_JOGADOR.quizzAtual = quizz;
}

function criarLayoutResultado() {
  return `
  <article style="display:none" class="resultado">
    <div class="resultado-titulo">
      <h3></h3>
    </div>
    <img src="" alt="Imagem não encontrada :(" />
    <p></p>
  </article>
  `;
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
    <img
      src="${alternativa.image}"
      alt="imagem não encontrada :("
    />
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

function criarTitulo(quizz) {
  return `
  <div class="titulo-container">
    <h2>${quizz.title}</h2>
    <div class="overlay"></div>
    <img src="${quizz.image}" alt="imagem não encontrada :(" />
  </div>
  `;
}

function criarTelaQuizz(quizz) {
  resetarStatusJogador(quizz);
  const titulo = criarTitulo(quizz);
  const perguntas = quizz.questions.reduce(
    (prev, curr) => prev + criarLayoutDaPergunta(curr),
    ""
  );
  const resultado = criarLayoutResultado();
  const telaQuizz = document.querySelector(".tela.quizz");
  telaQuizz.innerHTML = titulo + perguntas + resultado;
  telaQuizz.style.display = "flex";
  window.scrollTo({ top: 0 });
}

export { criarTelaQuizz };
