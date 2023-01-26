import { getQuizzes } from "./api.js";
import { criarTelaQuizz, tagImgCustomizada } from "./telaQuizz.js";

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
            ${tagImgCustomizada({
              classes: "imgQuizz",
              src: Quizzes[cont].image,
              alt: Quizzes[cont].title,
            })}
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

window.criarTeste = function(){
    const criar = document.querySelector('.criarQuiz');
    criar.classList.add('remocaoDisplay');
    const aparecerPagina1 = document.querySelector('.pagina1');
    aparecerPagina1.classList.remove('remocaoDisplay');
}

window.criarComeco = function(){
    const criar = document.querySelector('.pagina1');
    criar.classList.add('remocaoDisplay');
    const aparecerPagina2 = document.querySelector('.pagina2');
    aparecerPagina2.classList.remove('remocaoDisplay');
}

window.perguntaUm = function(){
    const pergunta = document.querySelector('.container2');
    const criarPerguntaUm = document.querySelector('.pergunta1Inicio');
    pergunta.classList.remove('remocaoDisplay');
    criarPerguntaUm.classList.add('remocaoDisplay');
}
window.perguntaDois = function(){
    const pergunta = document.querySelector('.container3');
    const criarPerguntaUm = document.querySelector('.pergunta2Inicio');
    pergunta.classList.remove('remocaoDisplay');
    criarPerguntaUm.classList.add('remocaoDisplay');
}
window.perguntaTres = function(){
    const pergunta = document.querySelector('.container4');
    const criarPerguntaUm = document.querySelector('.pergunta3Inicio');
    pergunta.classList.remove('remocaoDisplay');
    criarPerguntaUm.classList.add('remocaoDisplay');
}
window.prosseguir = function(){
    const criar = document.querySelector('.pagina2');
    criar.classList.add('remocaoDisplay');
    const aparecerPagina3 = document.querySelector('.pagina3');
    aparecerPagina3.classList.remove('remocaoDisplay');
}
window.nivel1 = function(){
    const pergunta = document.querySelector('.container5');
    const criarNivelUm = document.querySelector('.nivel1Inicio');
    pergunta.classList.remove('remocaoDisplay');
    criarNivelUm.classList.add('remocaoDisplay');
}
window.nivel2 = function(){
    const pergunta = document.querySelector('.container6');
    const criarNivelDois = document.querySelector('.nivel2Inicio');
    pergunta.classList.remove('remocaoDisplay');
    criarNivelDois.classList.add('remocaoDisplay');
}
window.nivel3 = function(){
    const pergunta = document.querySelector('.container7');
    const criarNivelTres = document.querySelector('.nivel3Inicio');
    pergunta.classList.remove('remocaoDisplay');
    criarNivelTres.classList.add('remocaoDisplay');
}
window.finalizar = function(){
    const criar = document.querySelector('.pagina3');
    criar.classList.add('remocaoDisplay');
    const aparecerPagina4 = document.querySelector('.pagina4');
    aparecerPagina4.classList.remove('remocaoDisplay');
}