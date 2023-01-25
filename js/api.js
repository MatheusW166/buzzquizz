const baseUrl = "https://mock-api.driven.com.br/api/v4/buzzquizz";

async function getQuizzes() {
  try {
    const res = await axios.get(baseUrl + "/quizzes");
    return res.data;
  } catch (err) {
    console.log(`Deu ruim rapaz: ${err}`);
    return err;
  }
}

export { getQuizzes };
