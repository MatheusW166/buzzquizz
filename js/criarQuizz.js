// Informações básicas
const INFO_BASICAS = {};

function getInfoBasicasQuizz() {
  return { ...INFO_BASICAS };
}

function buildInfoBasicasQuizz({ title, image, questions, levels }) {
  INFO_BASICAS.title = title;
  INFO_BASICAS.image = image;
  INFO_BASICAS.nPerguntas = questions;
  INFO_BASICAS.nLevels = levels;
  return getInfoBasicasQuizz();
}

// Úteis
function fecharTodosOsContainers(parent) {
  const containers = parent.querySelectorAll(".container");
  const toggles = parent.querySelectorAll(".toggle");
  containers.forEach((element) => element.classList.add("remocaoDisplay"));
  toggles.forEach((element) => element.classList.remove("remocaoDisplay"));
}

const acaoAbrirContainer = (event) => {
  const toggle = event.currentTarget;
  const paginaAtual = toggle.parentElement.parentElement;
  fecharTodosOsContainers(paginaAtual);
  const container = toggle.previousElementSibling;
  container.classList.remove("remocaoDisplay");
  toggle.classList.add("remocaoDisplay");

  container.scrollIntoView(true);
  window.scrollBy(0, -100);
};

function addAcoesAbrirContainerNosToggles(parent) {
  const toggles = parent.querySelectorAll(".toggle");
  toggles.forEach((element) => (element.onclick = acaoAbrirContainer));
}

// Perguntas
const QUESTIONS = [];

function resetarQuestions() {
  QUESTIONS.length = 0;
}

function addQuestion(question) {
  QUESTIONS.push(question);
}

function getQuestions() {
  return QUESTIONS;
}

function buildQuestionAnswer({ text, image, isCorrectAnswer = false }) {
  return {
    text,
    image,
    isCorrectAnswer,
  };
}

function buildQuestion({ title, color, answers = null }) {
  return {
    title,
    color,
    answers,
  };
}

function isImagemUrlValida(imageUrl) {
  return window.validarURL(imageUrl);
}

function isTextoRespostaValido(texto) {
  return texto && texto.length > 0;
}

function isTextoPerguntaValido(texto) {
  return texto && texto.length >= 20;
}

function isCorDeFundoValida(cor) {
  const hex6digitos = /^#[A-F\d]{6}$/gi;
  const hex3digitosIguais = /^#([A-F\d])\1{2}$/gi;
  return hex6digitos.test(cor) || hex3digitosIguais.test(cor);
}

function getCabecalhoValidoPergunta(containerPergunta) {
  const inputTextoPergunta = containerPergunta.querySelector(".texto-pergunta");
  const inputCorPergunta = inputTextoPergunta.nextElementSibling;
  if (
    !isTextoPerguntaValido(inputTextoPergunta.value) ||
    !isCorDeFundoValida(inputCorPergunta.value)
  ) {
    return false;
  }

  return buildQuestion({
    title: inputTextoPergunta.value,
    color: inputCorPergunta.value,
    answers: null,
  });
}

function getRespostasValidasPergunta(containerPergunta) {
  const respostasValidas = [];
  const inputsRespostasErradas = containerPergunta.querySelectorAll(
    ".resposta-incorreta"
  );

  for (let i = 0; i < inputsRespostasErradas.length; i++) {
    const respostaErradaInput = inputsRespostasErradas[i];
    const respostaErradaImage = respostaErradaInput.nextElementSibling.value;
    if (
      isTextoRespostaValido(respostaErradaInput.value) &&
      isImagemUrlValida(respostaErradaImage)
    ) {
      respostasValidas.push(
        buildQuestionAnswer({
          text: respostaErradaInput.value,
          image: respostaErradaImage,
          isCorrectAnswer: false,
        })
      );
    }
  }

  const inputRespostaCorreta =
    containerPergunta.querySelector(".resposta-correta");
  const imagemRespostaCorreta = inputRespostaCorreta.nextElementSibling.value;

  if (
    respostasValidas.length === 0 ||
    !isTextoRespostaValido(inputRespostaCorreta.value) ||
    !isImagemUrlValida(imagemRespostaCorreta)
  ) {
    return false;
  }

  respostasValidas.push(
    buildQuestionAnswer({
      text: inputRespostaCorreta.value,
      image: imagemRespostaCorreta,
      isCorrectAnswer: true,
    })
  );

  return respostasValidas;
}

function getPerguntasValidas() {
  resetarQuestions();
  const conatinersPerguntas = document.querySelectorAll(".container-pergunta");
  for (let i = 0; i < conatinersPerguntas.length; i++) {
    const question = getCabecalhoValidoPergunta(conatinersPerguntas[i]);
    const answers = getRespostasValidasPergunta(conatinersPerguntas[i]);
    if (!question || !answers) return false;
    question.answers = answers;
    addQuestion(question);
  }

  return getQuestions();
}

function criarLayoutPergunta(idx) {
  return `
    <div class="container container-pergunta container2 remocaoDisplay">
        <div class="pergunta1">
            <p class="digitePergunta">Pergunta ${idx}</p>
            <div class="inputs2">
                <input class="texto-pergunta texto" placeholder="Texto da pergunta" />
                <input class="cor" placeholder="Cor de fundo da pergunta" />
            </div>
        </div>
        <div class="pergunta1">
            <p class="digitePergunta">Resposta correta</p>
            <div class="inputs2">
                <input class="resposta-correta resposta" placeholder="Resposta correta" />
                <input class="imagem" placeholder="URL da imagem" />
            </div>
        </div>
        <div class="pergunta1">
            <p class="digitePergunta">Respostas incorretas</p>
            <div class="inputs2">
                <input class="resposta-incorreta incorreta1" placeholder="Resposta incorreta 1" />
                <input class="imagemIncorreta1" placeholder="URL da imagem 1" />
                <input class="resposta-incorreta incorreta2" placeholder="Resposta incorreta 2" />
                <input class="imagemIncorreta1" placeholder="URL da imagem 2" />
                <input class="resposta-incorreta incorreta3" placeholder="Resposta incorreta 3" />
                <input class="imagemIncorreta3" placeholder="URL da imagem 3" />
            </div>
        </div>
    </div>
    <div class="toggle pergunta1Inicio">
        <p class="digitePergunta1">Pergunta ${idx}</p>
        <div class="ion">
            <ion-icon name="create-outline"></ion-icon>
        </div>
    </div>
    `;
}

function criarTelaPerguntas(infoBasicas) {
  const info = buildInfoBasicasQuizz(infoBasicas);
  const telaCriarPerguntas = document.querySelector(".criar-perguntas");
  const inputsPerguntas = telaCriarPerguntas.querySelector(".inputs-perguntas");
  let layoutPerguntas = "";
  for (let i = 0; i < info.nPerguntas; i++) {
    layoutPerguntas += criarLayoutPergunta(i + 1);
  }
  inputsPerguntas.innerHTML = layoutPerguntas;
  addAcoesAbrirContainerNosToggles(telaCriarPerguntas);
}

export { criarTelaPerguntas, getPerguntasValidas };

// Níveis
const LEVELS = [];

function resetarLevels() {
  LEVELS.length = 0;
}

function addLevel(level) {
  LEVELS.push(level);
}

function getLevels() {
  return LEVELS;
}

function buildLevel({ title, image, text, minValue = 0 }) {
  return {
    title,
    image,
    text,
    minValue,
  };
}

function criarLayoutNivel(idx) {
  return `
  <div class="container container-nivel container5 remocaoDisplay">
    <div class="pergunta1">
      <p class="digitePergunta">Nível ${idx}</p>
      <div class="inputs2">
        <input class="tituloNivel" placeholder="Título do nível" />
        <input class="percentual" placeholder="% de acerto mínima" />
        <input
          class="URLnivel"
          placeholder="URL da imagem do nível"
        />
        <input class="descricao" placeholder="Descrição do nível" />
      </div>
    </div>
  </div>
  <div class="toggle nivel1Inicio">
    <p class="digitePergunta1">Nível ${idx}</p>
    <div class="ion">
      <ion-icon name="create-outline"></ion-icon>
    </div>
  </div>
  `;
}

function criarTelaNiveis() {
  const { nLevels } = getInfoBasicasQuizz();
  const telaCriarNiveis = document.querySelector(".criar-niveis");
  const inputsNiveis = telaCriarNiveis.querySelector(".inputs-niveis");

  let layoutNiveis = "";
  for (let i = 0; i < nLevels; i++) {
    layoutNiveis += criarLayoutNivel(i + 1);
  }
  inputsNiveis.innerHTML = layoutNiveis;
  addAcoesAbrirContainerNosToggles(telaCriarNiveis);
}

export { criarTelaNiveis };
