import { getQuizzes } from "./api.js";
import { criarTelaQuizz, tagImgCustomizada } from "./telaQuizz.js";

let Quizzes = [];
getQuizzes().then((res) => {
  console.log(res);
  Quizzes = res;
  exibirQuizzes();
});

const abrirTelaQuizz = (elementoClicado) => {
  const quizz = Quizzes.filter((quizz) => quizz.id == elementoClicado.id)[0];
  criarTelaQuizz(quizz);
  const outrasTelas = document.querySelectorAll(".tela:not(.quizz)");
  outrasTelas.forEach((tela) => (tela.style.display = "none"));
};

function criarLayoutQuizzListado(quizz) {
  return `
  <li id="${quizz.id}" class="QuizzListado clicavel">
    ${tagImgCustomizada({
      classes: "imgQuizz",
      src: quizz.image,
      alt: quizz.title,
    })}
    <label class="tituloQuizz">${quizz.title}</label>
  </li>
  `;
}

function acaoClicarNosQuizzesListados() {
  const quizzesListados = document.querySelectorAll(".QuizzListado");
  quizzesListados.forEach((quizzListado) => {
    quizzListado.onclick = (e) => abrirTelaQuizz(e.currentTarget);
  });
}

function exibirQuizzes() {
  const listaQuizzes = document.querySelector(".listaQuizzes");
  listaQuizzes.innerHTML = "";
  for (let cont = 0; cont < Quizzes.length; cont++) {
    let template = criarLayoutQuizzListado(Quizzes[cont]);
    listaQuizzes.innerHTML += template;
  }
  armazenarQuizesLocal();
  pegarQuizesLocais();
  acaoClicarNosQuizzesListados();
}

function armazenarQuizesLocal() {
  for (let cont = 0; cont < 3; cont++) {
    const QuizLocal = Quizzes[cont]; // Array que você quer salvar
    const QuizSerializado = JSON.stringify(QuizLocal); // Array convertida pra uma string
    const id = Quizzes[cont].id;
    localStorage.setItem(id, QuizSerializado); // Armazenando a string na chave "lista" do Local Storage
  }
}

function pegarQuizesLocais() {
  let QuizLocal;
  for (let cont = 0; cont < 3; cont++) {
    const id = Quizzes[cont].id;
    const QuizSerializado = localStorage.getItem(id); // Pegando de volta a string armazenada na chave "lista"
    QuizLocal = JSON.parse(QuizSerializado); // Transformando a string de volta na array original
    exibirQuizzesLocais(QuizLocal);
  }
}

function exibirQuizzesLocais(QuizLocal) {
  const listaQuizzes = document.querySelector(".listaQuizzesLocais");

  let template = `
  <li id="${QuizLocal.id}" class="QuizzListado clicavel">
      ${tagImgCustomizada({
        classes: "imgQuizz",
        src: QuizLocal.image,
        alt: QuizLocal.title,
      })}
      <label class="tituloQuizz">${QuizLocal.title}</label>
  </li>`;
  listaQuizzes.innerHTML += template;
}
export {};

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
  }
};

window.criarComeco = function () {
  const inputTitulo = document.querySelector(".titulo").value;
  const inputURL = document.querySelector(".url").value;
  if (!validacaoTituloQuizz(inputTitulo) || !validarURL(inputURL)) {
    alert("Ocorreu um erro! Preencha os dados corretamente");
    return;
  }
  const criar = document.querySelector(".pagina1");
  criar.classList.add("remocaoDisplay");
  const aparecerPagina2 = document.querySelector(".pagina2");
  aparecerPagina2.classList.remove("remocaoDisplay");
};

window.perguntaUm = function () {
  const pergunta = document.querySelector(".container2");
  const criarPerguntaUm = document.querySelector(".pergunta1Inicio");
  pergunta.classList.remove("remocaoDisplay");
  criarPerguntaUm.classList.add("remocaoDisplay");
};

window.perguntaDois = function () {
  const pergunta = document.querySelector(".container3");
  const criarPerguntaUm = document.querySelector(".pergunta2Inicio");
  pergunta.classList.remove("remocaoDisplay");
  criarPerguntaUm.classList.add("remocaoDisplay");
};

window.perguntaTres = function () {
  const pergunta = document.querySelector(".container4");
  const criarPerguntaUm = document.querySelector(".pergunta3Inicio");
  pergunta.classList.remove("remocaoDisplay");
  criarPerguntaUm.classList.add("remocaoDisplay");
};
window.prosseguir = function () {
  const criar = document.querySelector(".pagina2");
  criar.classList.add("remocaoDisplay");
  const aparecerPagina3 = document.querySelector(".pagina3");
  aparecerPagina3.classList.remove("remocaoDisplay");
};
window.nivel1 = function () {
  const pergunta = document.querySelector(".container5");
  const criarNivelUm = document.querySelector(".nivel1Inicio");
  pergunta.classList.remove("remocaoDisplay");
  criarNivelUm.classList.add("remocaoDisplay");
};
window.nivel2 = function () {
  const pergunta = document.querySelector(".container6");
  const criarNivelDois = document.querySelector(".nivel2Inicio");
  pergunta.classList.remove("remocaoDisplay");
  criarNivelDois.classList.add("remocaoDisplay");
};
window.nivel3 = function () {
  const pergunta = document.querySelector(".container7");
  const criarNivelTres = document.querySelector(".nivel3Inicio");
  pergunta.classList.remove("remocaoDisplay");
  criarNivelTres.classList.add("remocaoDisplay");
};
window.finalizar = function () {
  finalizar();
};

function finalizar() {
  const criar = document.querySelector(".pagina3");
  criar.classList.add("remocaoDisplay");
  let quizesLocais = document.querySelector(".QuizesUsuario");
  quizesLocais.classList.remove("sumir");
  quizesLocais = document.querySelector(".listaQuizzesLocais");
  quizesLocais.classList.remove("sumir");
  quizesLocais = document.querySelector(".todosOsQuizzes");
  quizesLocais.classList.remove("sumir");
  quizesLocais = document.querySelector(".listaQuizzes");
  quizesLocais.classList.remove("sumir");
}

finalizar();
