import { getQuizzes } from "./api.js";

getQuizzes().then((res) => console.log(res));

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