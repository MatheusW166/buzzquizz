const baseUrl = "https://mock-api.driven.com.br/api/v4/buzzquizz";

// Retorna todos os quizzes
async function getQuizzes() {
  try {
    const res = await axios.get(baseUrl + "/quizzes");
    return res.data;
  } catch (err) {
    console.log(`Deu ruim rapaz: ${err}`);
    return err;
  }
}

// Retorna o quizz com o id passado
async function getQuizzPorId(idQuizz) {
  try {
    const res = await axios.get(baseUrl + `/quizzes/${idQuizz}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

// Salva o quizz no servidor (necessário salvar a 'key' com localStorage)
async function criarQuizz(quizz) {
  try {
    const res = await axios.post(baseUrl + "/quizzes", quizz);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

// (Bônus) Apaga o quizz com o id passado
async function apagarQuizz(idQuizz, key) {
  try {
    const res = await axios.delete(baseUrl + `/quizzes/${idQuizz}`, {
      headers: { "Secret-Key": key },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

// (Bônus) Atualiza o quizz com o id passado
async function atualizarQuizz(idQuizz, novoQuizz, key) {
  try {
    const res = await axios.put(baseUrl + `/quizzes/${idQuizz}`, novoQuizz, {
      headers: { "Secret-Key": key },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export { getQuizzes, getQuizzPorId, criarQuizz, apagarQuizz, atualizarQuizz };
