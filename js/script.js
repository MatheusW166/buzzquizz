import { getQuizzes } from "./api.js";
let Quizzes = [];
getQuizzes().then((res) => {
    console.log(res);
    Quizzes = res;
    exibirQuizzes();
})
export {};
function exibirQuizzes(){
    const listaQuizzes = document.querySelector('.listaQuizzes');
    listaQuizzes.innerHTML = '';
    for(let cont=0; cont<Quizzes.length; cont++){
        let template = `
        <li class="QuizzListado">
            <img class="imgQuizz" src="${Quizzes[cont].image}" alt="${Quizzes[cont].title}">
            <label class="tituloQuizz">${Quizzes[cont].title}</label>
        </li>`;
        listaQuizzes.innerHTML += template;
        
        
    }
}

