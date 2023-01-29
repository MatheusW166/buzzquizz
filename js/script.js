import { getQuizzes } from "./api.js";
import { criarTelaQuizz, tagImgCustomizada } from "./telaQuizz.js";
import {
  criarTelaPerguntas,
  getPerguntasValidas,
  criarTelaNiveis,
  getNiveisValidos,
  salvarQuizz,
  criarTelaSucesso,
} from "./criarQuizz.js";

let Quizzes = [];
getQuizzes().then((res) => {
  console.log(res);
  Quizzes = res;
  exibirQuizzes();
});

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

function addAcaoClicarNosQuizzesListados() {
  const quizzesListados = document.querySelectorAll(".QuizzListado");
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
  carregareExibirQuizzesLocais();
  addAcaoClicarNosQuizzesListados();
}

function carregareExibirQuizzesLocais() {
  const quizzesLocais = pegarQuizesLocais();
  if (quizzesLocais.length > 0) mostrarQuizzesLocais();
}

function armazenarQuizzLocal(quizz) {
  const QuizSerializado = JSON.stringify(quizz); // Array convertida pra uma string
  localStorage.setItem(quizz.id, QuizSerializado); // Armazenando a string na chave "lista" do Local Storage
  carregareExibirQuizzesLocais(); // Atualiza a lista de quizzes locais
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
    (element) => (template += criarLayoutQuizzListado(element))
  );
  const listaQuizzes = document.querySelector(".listaQuizzesLocais");
  listaQuizzes.innerHTML = template;
}

function mostrarQuizzesLocais() {
  const botaoCriarQuizzes = document.querySelector(".criarQuiz");
  botaoCriarQuizzes.classList.add("remocaoDisplay");
  const quizzesUsuario = document.querySelector(".QuizesUsuario");
  const listaQuizzesUsuario = quizzesUsuario.nextElementSibling;
  quizzesUsuario.classList.remove("sumir");
  listaQuizzesUsuario.classList.remove("sumir");
}

function ocultarQuizzesLocais() {
  const botaoCriarQuizzes = document.querySelector(".criarQuiz");
  botaoCriarQuizzes.classList.remove("remocaoDisplay");
  const quizzesUsuario = document.querySelector(".QuizesUsuario");
  const listaQuizzesUsuario = quizzesUsuario.nextElementSibling;
  quizzesUsuario.classList.add("sumir");
  listaQuizzesUsuario.classList.add("sumir");
}

window.validacaoTituloQuizz = function (inputTitulo) {
  if (inputTitulo.length < 20 || inputTitulo.length > 65) {
    return false;
  }
  return true;
};

window.validarURL = function (inputURL) {
  try {
    const link = new URL(inputURL);
    return link.protocol === "http:" || link.protocol === "https:";
  } catch (error) {
    console.log(error);
    return false;
  }
};

window.criarTeste = function () {
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
};

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

  const criar = document.querySelector(".pagina1");
  criar.classList.add("remocaoDisplay");
  const aparecerPagina2 = document.querySelector(".pagina2");
  aparecerPagina2.classList.remove("remocaoDisplay");
};

window.prosseguir = function () {
  if (!getPerguntasValidas()) {
    alert("Ocorreu um erro! Preencha os dados corretamente.");
    return;
  }

  criarTelaNiveis();

  const criar = document.querySelector(".pagina2");
  criar.classList.add("remocaoDisplay");
  const aparecerPagina3 = document.querySelector(".pagina3");
  aparecerPagina3.classList.remove("remocaoDisplay");
};

function abrirTelaSucesso() {
  ocultarQuizzesLocais();
  document.querySelector(".criar-niveis").classList.add("remocaoDisplay");
  document.querySelector(".sucesso-criacao").classList.remove("remocaoDisplay");
}

window.finalizar = function () {
  if (!getNiveisValidos()) {
    alert("Ocorreu um erro! Preencha os dados corretamente.");
    return;
  }

  salvarQuizz()
    .then((quizz) => {
      armazenarQuizzLocal(quizz);
      criarTelaSucesso(quizz);
      abrirTelaSucesso();
    })
    .catch((_) => alert("Não foi possível salvar seu quizz!"));
};

export { criarLayoutQuizzListado, abrirTelaQuizz };
