const STATES = {
  respondida: "respondida",
  marcada: "marcada",
  correta: "correta",
  errada: "errada",
};

function scrollarProximaPergunta(element) {
  const limiteSuperiorScroll =
    element.getBoundingClientRect().top + window.pageYOffset - 250;
  window.scrollTo({ top: limiteSuperiorScroll, behavior: "smooth" });
}

const DELAY_SCROLL = 2 * 1000; // 2 segundos
window.marcarResposta = (alternativa) => {
  const containerDaPergunta = alternativa.parentElement.parentElement;
  if (containerDaPergunta.classList.contains(STATES.respondida)) {
    return;
  }
  alternativa.classList.add(STATES.marcada);
  containerDaPergunta.classList.add(STATES.respondida);
  const proximaPergunta = containerDaPergunta.nextElementSibling;
  if (!proximaPergunta) {
    return;
  }
  setTimeout(() => scrollarProximaPergunta(proximaPergunta), DELAY_SCROLL);
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
  const titulo = criarTitulo(quizz);
  const perguntas = quizz.questions.reduce(
    (prev, curr) => prev + criarLayoutDaPergunta(curr),
    ""
  );
  const telaQuizz = document.querySelector(".tela.quizz");
  telaQuizz.innerHTML = titulo + perguntas;
  telaQuizz.style.display = "flex";
}

export { criarTelaQuizz };
