import { criarQuizz } from "./api.js";
import {
  criarLayoutQuizzListado,
  abrirTelaQuizz,
  atualizarListasQuizzes,
} from "./script.js";

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

// Input Handlers
const ERROR_TEXTS = {
  titulo: "O título deve ter de 20 à 65 letras",
  url: "Insira uma url válida",
  perguntas: "Escolha no mínimo 3 perguntas",
  niveis: "Escolha no mínimo 2 níveis",
  "texto-pergunta": "A pergunta deve ter no mínimo 20 letras",
  cor: "Coloque a cor em hexadecimal: #000000",
  resposta: "A resposta não pode ficar vazia",
  imagem: "Insira uma url de imagem válida",
  tituloNivel: "O título deve ter no mínimo 10 letras",
  percentual: "O percentual deve ser um número de 0 à 100",
  URLnivel: "Insira uma url de imagem válida",
  descricao: "A descrição deve ter no mínimo 30 letras",
};

const tituloTextError = (titulo) =>
  window.validacaoTituloQuizz(titulo) ? "" : ERROR_TEXTS["titulo"];
const urlTextError = (url) =>
  window.validarURL(url) ? "" : ERROR_TEXTS["url"];
const perguntasTextError = (nDePerguntas) =>
  nDePerguntas >= 3 ? "" : ERROR_TEXTS["perguntas"];
const niveisTextError = (nDeNiveis) =>
  nDeNiveis >= 2 ? "" : ERROR_TEXTS["niveis"];
const tituloPerguntaTextError = (titulo) =>
  isTextoPerguntaValido(titulo) ? "" : ERROR_TEXTS["texto-pergunta"];
const corTextError = (cor) =>
  isCorDeFundoValida(cor) ? "" : ERROR_TEXTS["cor"];
const respostaTextError = (resposta) =>
  isTextoRespostaValido(resposta) ? "" : ERROR_TEXTS["resposta"];
const tituloNivelTextError = (titulo) =>
  isTituloNivelValid(titulo) ? "" : ERROR_TEXTS["tituloNivel"];
const percentualTextError = (percentual) =>
  isPorcentagemMinimaValid(percentual) ? "" : ERROR_TEXTS["percentual"];
const descricaoTextError = (descricao) =>
  isDescricaoNivelValid(descricao) ? "" : ERROR_TEXTS["descricao"];

const INPUTS_ONERROR = {
  titulo: tituloTextError,
  url: urlTextError,
  perguntas: perguntasTextError,
  niveis: niveisTextError,
  "texto-pergunta": tituloPerguntaTextError,
  cor: corTextError,
  resposta: respostaTextError,
  imagem: urlTextError,
  tituloNivel: tituloNivelTextError,
  percentual: percentualTextError,
  URLnivel: urlTextError,
  descricao: descricaoTextError,
};

function addErroNoSpan(span, message = "") {
  if (span.innerHTML === message) return;
  span.innerHTML = message;
}

function removerErroDoSpan(span) {
  if (span.innerHTML === "") return;
  span.innerHTML = "";
}

window.handleErroOnChange = function (input) {
  const spanComMsgDeErro = input.nextElementSibling;
  if (!input.value) {
    removerErroDoSpan(spanComMsgDeErro);
    return;
  }
  const tipoInput = input.classList[0];
  const errorText = INPUTS_ONERROR[tipoInput](input.value);

  addErroNoSpan(spanComMsgDeErro, errorText);
};

// Úteis
function addLoading() {
  document.querySelector(".loading.full-screen").classList.remove("hidden");
}

function removeLoading() {
  document.querySelector(".loading.full-screen").classList.add("hidden");
}

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
  return texto && texto.trim().length > 0;
}

function isTextoPerguntaValido(texto) {
  return texto && texto.trim().length >= 20;
}

function isCorDeFundoValida(cor) {
  const hex6digitos = /^#[A-F\d]{6}$/gi;
  return hex6digitos.test(cor);
}

function getCabecalhoValidoPergunta(containerPergunta) {
  const inputTextoPergunta = containerPergunta.querySelector(".texto-pergunta");
  const inputCorPergunta = containerPergunta.querySelector(".cor");
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
    const respostaErradaImage =
      respostaErradaInput.parentElement.nextElementSibling.firstElementChild
        .value;
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
  const imagemRespostaCorreta =
    inputRespostaCorreta.parentElement.nextElementSibling.firstElementChild
      .value;

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
    if (!question || !answers) {
      return false;
    }
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
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="texto-pergunta texto" placeholder="Texto da pergunta" />
                  <span></span>
                </label>
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="cor" placeholder="Cor de fundo da pergunta" />
                  <span></span>
                </label>
            </div>
        </div>
        <div class="pergunta1">
            <p class="digitePergunta">Resposta correta</p>
            <div class="inputs2">
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="resposta resposta-correta" placeholder="Resposta correta" />
                  <span></span>
                </label>
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="imagem" placeholder="URL da imagem" />
                  <span></span>
                </label>
            </div>
        </div>
        <div class="pergunta1">
            <p class="digitePergunta">Respostas incorretas</p>
            <div class="inputs2">
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="resposta resposta-incorreta incorreta1" placeholder="Resposta incorreta 1" />
                  <span></span>
                </label>
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="imagem imagemIncorreta1" placeholder="URL da imagem 1" />
                  <span></span>
                </label>
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="resposta resposta-incorreta incorreta2" placeholder="Resposta incorreta 2" />
                  <span></span>
                </label>
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="imagem imagemIncorreta1" placeholder="URL da imagem 2" />
                  <span></span>
                </label>
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="resposta resposta-incorreta incorreta3" placeholder="Resposta incorreta 3" />
                  <span></span>
                </label>
                <label class="labeled-input">
                  <input oninput="handleErroOnChange(this)" class="imagem imagemIncorreta3" placeholder="URL da imagem 3" />
                  <span></span>
                </label>
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
  return telaCriarPerguntas;
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

function isTituloNivelValid(titulo) {
  return titulo && titulo.trim().length >= 10;
}

function isDescricaoNivelValid(descricao) {
  return descricao && descricao.trim().length >= 30;
}

function isPorcentagemMinimaValid(porcentagem) {
  const porcentagemEmNumber = Number(porcentagem);
  return (
    !isNaN(porcentagemEmNumber) &&
    porcentagemEmNumber >= 0 &&
    porcentagemEmNumber <= 100
  );
}

function getNivelValido(containerNivel) {
  const titulo = containerNivel.querySelector(".tituloNivel").value;
  const percentual = containerNivel.querySelector(".percentual").value;
  const image = containerNivel.querySelector(".URLnivel").value;
  const descricao = containerNivel.querySelector(".descricao").value;

  if (
    isTituloNivelValid(titulo) &&
    isPorcentagemMinimaValid(percentual) &&
    isImagemUrlValida(image) &&
    isDescricaoNivelValid(descricao)
  ) {
    return buildLevel({
      title: titulo,
      image: image,
      text: descricao,
      minValue: Number(percentual),
    });
  }

  return false;
}

function getNiveisValidos() {
  resetarLevels();
  const containersNiveis = document.querySelectorAll(".container-nivel");
  let possuiNivelZero = false;
  for (let i = 0; i < containersNiveis.length; i++) {
    const nivel = getNivelValido(containersNiveis[i]);
    if (!nivel) return false;
    addLevel(nivel);
    if (nivel.minValue === 0) possuiNivelZero = true;
  }
  if (!possuiNivelZero) {
    return { error: "Um dos níveis deve ser igual a zero." };
  }
  return getLevels();
}

function criarLayoutNivel(idx) {
  return `
  <div class="container container-nivel container5 remocaoDisplay">
    <div class="pergunta1">
      <p class="digitePergunta">Nível ${idx}</p>
      <div class="inputs2">
        <label class="labeled-input">
          <input oninput="handleErroOnChange(this)" class="tituloNivel" placeholder="Título do nível" />
          <span></span>
        </label>
        <label class="labeled-input">
          <input oninput="handleErroOnChange(this)" class="percentual" placeholder="% de acerto mínima" />
          <span></span>
        </label>
        <label class="labeled-input">
          <input oninput="handleErroOnChange(this)"
            class="URLnivel"
            placeholder="URL da imagem do nível"
          />
          <span></span>
        </label>
        <label class="labeled-input">
          <input oninput="handleErroOnChange(this)" class="descricao" placeholder="Descrição do nível" />
          <span></span>
        </label>
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

export { criarTelaNiveis, getNiveisValidos };

// Build quizz
function buildNovoQuizz() {
  const infoBasic = getInfoBasicasQuizz();
  const questions = getQuestions();
  const levels = getLevels();
  return {
    title: infoBasic.title,
    image: infoBasic.image,
    questions: questions,
    levels: levels,
  };
}

async function salvarQuizz() {
  try {
    addLoading();
    const quizz = buildNovoQuizz();
    const res = await criarQuizz(quizz);
    return res;
  } catch (err) {
    throw err;
  } finally {
    removeLoading();
  }
}

export { salvarQuizz };

// Sucesso na criação
function voltarDoSucessoPraHome() {
  document.querySelector(".sucesso-criacao").classList.add("remocaoDisplay");
  const quizzesUsuario = document.querySelector(".QuizesUsuario");
  const quizzesLocais = quizzesUsuario.nextElementSibling;
  const todosOsQuizzes = quizzesLocais.nextElementSibling;
  const listaQuizzes = todosOsQuizzes.nextElementSibling;
  quizzesUsuario.classList.remove("sumir");
  quizzesLocais.classList.remove("sumir");
  todosOsQuizzes.classList.remove("sumir");
  listaQuizzes.classList.remove("sumir");
  atualizarListasQuizzes();
}

function criarLayoutOpcoesSucesso() {
  return `
  <div style="display:flex" class="navegacao-quizz">
    <button onclick="" class="reiniciar-btn">Acessar Quizz</button>
    <button onclick="voltarDoSucessoPraHome()" class="home-btn">Voltar pra home</button>
  </div>
  `;
}

function addAcoesOpcoesSucesso(telaSucesso, quizz) {
  const btnAcessarQuizz = telaSucesso.querySelector(".reiniciar-btn");
  const btnVoltar = btnAcessarQuizz.nextElementSibling;
  btnAcessarQuizz.onclick = () => abrirTelaQuizz(btnAcessarQuizz, quizz);
  btnVoltar.onclick = voltarDoSucessoPraHome;
}

function criarTelaSucesso(quizz) {
  const telaSucesso = document.querySelector(".sucesso-criacao");
  const quizzListado = criarLayoutQuizzListado(quizz, "div");
  const opcoesSucesso = criarLayoutOpcoesSucesso();
  telaSucesso.innerHTML += quizzListado + opcoesSucesso;
  addAcoesOpcoesSucesso(telaSucesso, quizz);
}

export { criarTelaSucesso, addLoading, removeLoading, buildNovoQuizz };
