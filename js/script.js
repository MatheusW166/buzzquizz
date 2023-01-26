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
  armazenarQuizesLocal();
  pegarQuizesLocais();
  const quizzesListados = document.querySelectorAll(".QuizzListado");
  quizzesListados.forEach((quizzListado, idx) => {
    quizzListado.onclick = () => abrirTelaQuizz(Quizzes[idx]);
  });
}


function armazenarQuizesLocal(){
    for(let cont = 0; cont < 3; cont++){
        const QuizLocal = Quizzes[cont];  // Array que você quer salvar
        const QuizSerializado = JSON.stringify(QuizLocal); // Array convertida pra uma string
        const id = Quizzes[cont].id;
        localStorage.setItem(id, QuizSerializado); // Armazenando a string na chave "lista" do Local Storage
    }
}
function pegarQuizesLocais(){
   let QuizLocal;
   for(let cont = 0; cont < 3; cont++){
        const id = Quizzes[cont].id;
        const QuizSerializado = localStorage.getItem(id); // Pegando de volta a string armazenada na chave "lista"
        QuizLocal = JSON.parse(QuizSerializado); // Transformando a string de volta na array original
        exibirQuizzesLocais(QuizLocal);
    }
}
function exibirQuizzesLocais(QuizLocal){
    const listaQuizzes = document.querySelector(".listaQuizzesLocais");
    
      let template = `
          <li class="QuizzListado clicavel">
              <img class="imgQuizz" src="${QuizLocal.image}" alt="${QuizLocal.title}">
              <label class="tituloQuizz">${QuizLocal.title}</label>
          </li>`;
      listaQuizzes.innerHTML += template;
}
export {};
