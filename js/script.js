import { getQuizzes } from "./api.js";
import { criarTelaQuizz } from "./telaQuizz.js";

let Quizzes = [];
getQuizzes().then((res) => {
  console.log(res);
  Quizzes = res;
  exibirQuizzes();
});

const abrirTelaQuizz = (quizz) => {
  const outrasTelas = document.querySelectorAll(".tela:not(.quizz)");
  criarTelaQuizz(quizz);
  outrasTelas.forEach((tela) => (tela.style.display = "none"));
  console.log(outrasTelas);
};

function exibirQuizzes() {
  const listaQuizzes = document.querySelector(".listaQuizzes");
  listaQuizzes.innerHTML = "";
  for (let cont = 0; cont < Quizzes.length; cont++) {
    let template = `
        <li class="QuizzListado clicavel">
            <img class="imgQuizz" src="${Quizzes[cont].image}" alt="${Quizzes[cont].title}">
            <label class="tituloQuizz">${Quizzes[cont].title}</label>
        </li>`;
    listaQuizzes.innerHTML += template;
  }

  const quizzesListados = document.querySelectorAll(".QuizzListado");
  quizzesListados.forEach((quizzListado, idx) => {
    quizzListado.onclick = () => abrirTelaQuizz(Quizzes[idx]);
  });
}

export {};
