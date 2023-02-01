import { getQuizzes, apagarQuizz, atualizarQuizz } from "./api.js";
import { criarTelaQuizz, tagImgCustomizada } from "./telaQuizz.js";
import {
  criarTelaPerguntas,
  getPerguntasValidas,
  criarTelaNiveis,
  getNiveisValidos,
  salvarQuizz,
  criarTelaSucesso,
  addLoading,
  removeLoading,
  buildNovoQuizz,
} from "./criarQuizz.js";

const QuizzEditado = {};

function isEditando() {
  return Object.keys(QuizzEditado).length > 0;
}

function setQuizzEditado(quizz) {
  Object.keys(quizz).forEach((key) => {
    QuizzEditado[key] = quizz[key];
  });
}

function clearQuizzEditado() {
  Object.keys(QuizzEditado).forEach((key) => {
    delete QuizzEditado[key];
  });
}

let Quizzes = [];

function atualizarListasQuizzes() {
  carregareExibirQuizzesLocais();
  getQuizzes().then((res) => {
    Quizzes = res;
    exibirQuizzes();
  });
}

atualizarListasQuizzes();

window.fecharModal = function () {
  const modal = document.querySelector(".modal-container");
  modal.classList.add("hidden");
};

function abrirModal() {
  const modal = document.querySelector(".modal-container");
  modal.classList.remove("hidden");
}

function mostrarModalCustomizado({
  title,
  mensagem,
  btnCancelarText = "Cancelar",
  btnConfirmarText = "Confirmar",
  onConfirmar,
  onCancelar,
}) {
  let naoInformado;
  if (!title) naoInformado = "title";
  else if (!mensagem) naoInformado = "mensagem";
  else if (!onConfirmar) naoInformado = "onConfirmar";
  if (naoInformado) throw Error(`'${naoInformado}' deve ser informado`);
  const modal = document.querySelector(".modal");
  const tituloContainer = modal.querySelector("h2");
  const mensagemContainer = modal.querySelector("main p");
  const btnConfirmar = modal.querySelector(".confirmar");
  const btnCancelar = modal.querySelector(".cancelar");
  tituloContainer.innerHTML = title;
  mensagemContainer.innerHTML = mensagem;
  btnConfirmar.innerHTML = btnConfirmarText;
  btnConfirmar.onclick = onConfirmar;
  btnCancelar.innerHTML = btnCancelarText;
  if (onCancelar) btnCancelar.onclick = onCancelar;
  abrirModal();
}

window.deletarQuizz = function (event, quizzId) {
  event.stopPropagation();
  const quizz = JSON.parse(localStorage.getItem(`${quizzId}`));

  mostrarModalCustomizado({
    title: "Deseja apagar este Quizz?",
    mensagem: `Você está prestes a apagar o Quizz "<strong>${quizz.title}</strong>"`,
    btnConfirmarText: "Apagar",
    onConfirmar: () => {
      window.fecharModal();
      addLoading();
      apagarQuizz(quizz.id, quizz.key)
        .then(() => {
          localStorage.removeItem(`${quizz.id}`);
          atualizarListasQuizzes();
          alert("Seu quizz foi apagado");
        })
        .catch(() => {
          alert("Não foi possível apagar o quizz");
        })
        .finally(() => removeLoading());
    },
  });
};

window.editarQuizz = function (event, quizzId) {
  event.stopPropagation();
  const quizzParaEditar = JSON.parse(localStorage.getItem(`${quizzId}`));
  setQuizzEditado(quizzParaEditar);
  window.criarTeste();
};

const abrirTelaQuizz = (elementoClicado, currentQuizz = null) => {
  const quizz =
    currentQuizz ||
    Quizzes.filter((quizz) => quizz.id == elementoClicado.id)[0];
  criarTelaQuizz(quizz);
  const outrasTelas = document.querySelectorAll(".tela:not(.quizz)");
  outrasTelas.forEach((tela) => (tela.style.display = "none"));
};

function criarLayoutQuizzListado(quizz, tag = "li") {
  return `
  <${tag} id="${quizz.id}" class="QuizzListado clicavel">
    ${tagImgCustomizada({
      classes: "imgQuizz",
      src: quizz.image,
      alt: quizz.title,
    })}
    <label class="tituloQuizz">${quizz.title}</label>
  </${tag}>
  `;
}

function criarLayoutQuizzLocal(quizz, tag = "li") {
  return `
  <div class="item-lista">
    <div class="quizz-lista-acoes">
      <ion-icon onclick="editarQuizz(event, ${
        quizz.id
      })" name="create-outline"></ion-icon>
      <ion-icon onclick="deletarQuizz(event, ${
        quizz.id
      })" name="trash-outline"></ion-icon>
    </div>
    <${tag} id="${quizz.id}" class="QuizzListado clicavel">
      ${tagImgCustomizada({
        classes: "imgQuizz",
        src: quizz.image,
        alt: quizz.title,
      })}
      <label class="tituloQuizz">${quizz.title}</label>
    </${tag}>
  </div>
  `;
}

function addAcaoClicarNosQuizzesListados() {
  const quizzesListados = document.querySelectorAll(
    ".listaQuizzes .QuizzListado"
  );
  quizzesListados.forEach((quizzListado) => {
    quizzListado.onclick = (e) => abrirTelaQuizz(e.currentTarget);
  });
}

function exibirQuizzes() {
  let template = "";
  for (let cont = 0; cont < Quizzes.length; cont++) {
    template += criarLayoutQuizzListado(Quizzes[cont]);
  }
  const listaQuizzes = document.querySelector(".listaQuizzes");
  listaQuizzes.innerHTML = template;
  addAcaoClicarNosQuizzesListados();
}

function carregareExibirQuizzesLocais() {
  const quizzesLocais = pegarQuizesLocais();
  if (quizzesLocais.length > 0) mostrarQuizzesLocais();
  else esvaziarQuizzesLocais();
}

function armazenarQuizzLocal(quizz) {
  const QuizSerializado = JSON.stringify(quizz); // Array convertida pra uma string
  localStorage.setItem(quizz.id, QuizSerializado); // Armazenando a string na chave "lista" do Local Storage
}

function pegarQuizesLocais() {
  const quizzesLocais = Object.values(localStorage);
  const QuizzesLocaisParsed = quizzesLocais.map((quizzArmazenado) => {
    return JSON.parse(quizzArmazenado); // Transformando a string de volta na array original
  });
  exibirQuizzesLocais(QuizzesLocaisParsed);
  return quizzesLocais;
}

function exibirQuizzesLocais(QuizzesLocais) {
  if (QuizzesLocais.length === 0) return;
  let template = "";
  QuizzesLocais.forEach(
    (element) => (template += criarLayoutQuizzLocal(element))
  );
  const listaQuizzes = document.querySelector(".listaQuizzesLocais");
  listaQuizzes.innerHTML = template;

  addAcaoClicarNosQuizzesLocais(QuizzesLocais);
}

function addAcaoClicarNosQuizzesLocais(QuizzesLocais) {
  const listaQuizzes = document.querySelector(".listaQuizzesLocais");
  const quizzesLocaisExibidos = listaQuizzes.querySelectorAll(".QuizzListado");
  quizzesLocaisExibidos.forEach((element, idx) => {
    element.onclick = () => abrirTelaQuizz(element, QuizzesLocais[idx]);
  });
}

function mostrarQuizzesLocais() {
  const botaoCriarQuizzes = document.querySelector(".criarQuiz");
  botaoCriarQuizzes.classList.add("remocaoDisplay");
  const quizzesUsuario = document.querySelector(".QuizesUsuario");
  const listaQuizzesUsuario = quizzesUsuario.nextElementSibling;
  quizzesUsuario.classList.remove("sumir");
  listaQuizzesUsuario.classList.remove("sumir");
}

function esvaziarQuizzesLocais() {
  const botaoCriarQuizzes = document.querySelector(".criarQuiz");
  botaoCriarQuizzes.classList.remove("remocaoDisplay");
  const quizzesUsuario = document.querySelector(".QuizesUsuario");
  const listaQuizzesUsuario = quizzesUsuario.nextElementSibling;
  quizzesUsuario.classList.add("sumir");
  listaQuizzesUsuario.classList.add("sumir");
  listaQuizzesUsuario.innerHTML = "";
}

window.validacaoTituloQuizz = function (inputTitulo) {
  const titulo = inputTitulo.trim();
  return titulo.length >= 20 && titulo.length <= 65;
};

window.validarURL = function (inputURL) {
  try {
    const link = new URL(inputURL);
    return link.protocol === "http:" || link.protocol === "https:";
  } catch (error) {
    return false;
  }
};

function limparTodosInputs() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((element) => (element.value = ""));
}

function preencherInformacoesBasicas(quizzParaEditar) {
  const { title, image, questions, levels } = quizzParaEditar;
  document.querySelector(".titulo").value = title;
  document.querySelector(".url").value = image;
  document.querySelector(".perguntas").value = questions.length;
  document.querySelector(".niveis").value = levels.length;
}

function abrirTelaDeInformacoesBasicas() {
  const criar = document.querySelector(".criarQuiz");
  criar.classList.add("remocaoDisplay");
  let quizesLocais = document.querySelector(".todosOsQuizzes");
  quizesLocais.classList.add("sumir");
  quizesLocais = document.querySelector(".listaQuizzes");
  quizesLocais.classList.add("sumir");
  quizesLocais = document.querySelector(".QuizesUsuario");
  quizesLocais.classList.add("sumir");
  quizesLocais = document.querySelector(".listaQuizzesLocais");
  quizesLocais.classList.add("sumir");
  const aparecerPagina1 = document.querySelector(".pagina1");
  aparecerPagina1.classList.remove("remocaoDisplay");
}

window.criarTeste = function () {
  limparTodosInputs();
  abrirTelaDeInformacoesBasicas();

  if (isEditando()) {
    preencherInformacoesBasicas(QuizzEditado);
  }
};

function preencherContainerPergunta(container, pergunta) {
  container.querySelector(".texto-pergunta").value = pergunta.title;
  container.querySelector(".cor").value = pergunta.color;

  // Correta
  const respostaCerta = pergunta.answers.filter(
    (resposta) => resposta.isCorrectAnswer
  )[0];
  const respCertaInput = container.querySelector(".resposta-correta");
  const imagemCertaInput =
    respCertaInput.parentElement.nextElementSibling.firstElementChild;
  respCertaInput.value = respostaCerta.text;
  imagemCertaInput.value = respostaCerta.image;

  // Incorretas
  const respostasErradas = pergunta.answers.filter(
    (resposta) => !resposta.isCorrectAnswer
  );
  const respErradasInputs = container.querySelectorAll(".resposta-incorreta");
  respostasErradas.forEach((resposta, idx) => {
    const erradaInput = respErradasInputs[idx];
    const erradaImageInput =
      erradaInput.parentElement.nextElementSibling.firstElementChild;
    erradaInput.value = resposta.text;
    erradaImageInput.value = resposta.image;
  });
}

function preencherTelaPerguntas(quizzParaEditar) {
  const containerPerguntas = document.querySelectorAll(".container-pergunta");

  const perguntas = quizzParaEditar.questions;
  containerPerguntas.forEach((container, idx) => {
    preencherContainerPergunta(container, perguntas[idx]);
  });
}

function abrirTelaDePerguntas() {
  const criar = document.querySelector(".pagina1");
  criar.classList.add("remocaoDisplay");
  const aparecerPagina2 = document.querySelector(".pagina2");
  aparecerPagina2.classList.remove("remocaoDisplay");
}

window.criarComeco = function () {
  const inputTitulo = document.querySelector(".titulo").value;
  const inputURL = document.querySelector(".url").value;
  const inputPerguntas = document.querySelector(".perguntas").value;
  const inputNiveis = document.querySelector(".niveis").value;
  if (!validacaoTituloQuizz(inputTitulo) || !validarURL(inputURL)) {
    alert("Ocorreu um erro! Preencha os dados corretamente");
    return;
  }
  if (inputPerguntas < 3) {
    alert("Ocorreu um erro! Preencha os dados corretamente");
    return;
  }
  if (inputNiveis < 2) {
    alert("Ocorreu um erro! Preencha os dados corretamente");
    return;
  }

  criarTelaPerguntas({
    title: inputTitulo,
    image: inputURL,
    questions: inputPerguntas,
    levels: inputNiveis,
  });

  if (isEditando()) {
    preencherTelaPerguntas(QuizzEditado);
  }

  abrirTelaDePerguntas();
};

function abrirTelaNiveis() {
  const criar = document.querySelector(".pagina2");
  criar.classList.add("remocaoDisplay");
  const aparecerPagina3 = document.querySelector(".pagina3");
  aparecerPagina3.classList.remove("remocaoDisplay");
}

function preencherNivel(containerNivel, level) {
  const tituloInput = containerNivel.querySelector(".tituloNivel");
  const percentualInput = containerNivel.querySelector(".percentual");
  const imageInput = containerNivel.querySelector(".URLnivel");
  const descricaoInput = containerNivel.querySelector(".descricao");

  tituloInput.value = level.title;
  percentualInput.value = level.minValue;
  imageInput.value = level.image;
  descricaoInput.value = level.text;
}

function preencherNiveis(quizz) {
  const containersNiveis = document.querySelectorAll(".container-nivel");

  const levels = quizz.levels;
  containersNiveis.forEach((container, idx) => {
    preencherNivel(container, levels[idx]);
  });
}

window.prosseguir = function () {
  if (!getPerguntasValidas()) {
    alert("Ocorreu um erro! Preencha os dados corretamente.");
    return;
  }

  criarTelaNiveis();

  if (isEditando()) {
    preencherNiveis(QuizzEditado);
  }

  abrirTelaNiveis();
};

function abrirTelaSucesso() {
  document.querySelector(".criar-niveis").classList.add("remocaoDisplay");
  document.querySelector(".sucesso-criacao").classList.remove("remocaoDisplay");
}

window.finalizar = function () {
  const res = getNiveisValidos();
  if (!res) {
    alert("Ocorreu um erro! Preencha os dados corretamente.");
    return;
  }

  if ("error" in res) {
    alert(res.error);
    return;
  }

  if (isEditando()) {
    const { id, key } = QuizzEditado;
    atualizarQuizz(id, buildNovoQuizz(), key)
      .then((quizz) => {
        armazenarQuizzLocal(quizz);
        criarTelaSucesso(quizz);
        abrirTelaSucesso();
      })
      .catch((err) => console.log(err));
    clearQuizzEditado();
    return;
  }

  salvarQuizz()
    .then((quizz) => {
      armazenarQuizzLocal(quizz);
      criarTelaSucesso(quizz);
      abrirTelaSucesso();
    })
    .catch((err) => console.log(err));
};

export { criarLayoutQuizzListado, abrirTelaQuizz, atualizarListasQuizzes };
