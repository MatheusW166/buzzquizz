[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MatheusW166/buzzquizz/blob/main/LICENCE)

<div align="center">
<p>| <a href="#autores">Autores</a> | <a href="#funcionalidades">Funcionalidades</a> | <a href="#screenshots">Screenshots</a> |<br/>| <a href="#stack">Stack</a> | <a href="#api">API</a> | <a href="#schemas">Schemas</a> |</p>
</div>

# BuzzQuizz
O aplicativo permite que o usuário jogue questionários de perguntas e respostas. Os questionários criados pelo usuário são salvos localmente e podem ser editados e excluídos. Os quizzes possuem no mínimo três questões com uma resposta certa e até três respostas erradas, e no mínimo dois níveis, que serão exibidos ao usuário ao final do jogo indicando sua colocação de acordo com o número de acertos.

Acesse o app [aqui](https://matheusw166.github.io/buzzquizz/).

## Autores
- [@MatheusW166](https://github.com/MatheusW166)
- [@RobertaCapalbo](https://github.com/RobertaCapalbo)
- [@Tundror](https://github.com/Tundror)

## Funcionalidades

- Jogar quizzes
- Criar, editar e deletar quizzes
- Responsividade

## Screenshots
![Home no Quizz](https://github.com/MatheusW166/buzzquizz/blob/main/refs/home.png)
![Home](https://github.com/MatheusW166/buzzquizz/blob/main/refs/home_local_quizzes.png)
![Quizz](https://github.com/MatheusW166/buzzquizz/blob/main/refs/quizz.png)
![Result](https://github.com/MatheusW166/buzzquizz/blob/main/refs/quizz_result.png)
![Creation](https://github.com/MatheusW166/buzzquizz/blob/main/refs/creating_quizz_1.png)

## Stack
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) ![Trello](https://img.shields.io/badge/Trello-%23026AA7.svg?style=for-the-badge&logo=Trello&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) 

## API
O projeto usa uma API pública da [Driven Education's](https://www.driven.com.br/).

### Obter os cinquenta quizzes mais recentes
```curl
  GET /api/quizzes
```
**Returns** array de [Quizz](#quizz)
<hr/>

### Obter quizz por id
```curl
  GET /api/quizzes/${id}
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Required**. ID do quizz desejado |

**Returns** um [Quizz](#quizz)
<hr/>

### Criar um quizz
```curl
  POST /api/quizzes
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `data`      | [Quizz](#quizz) | **Required**. Quizz que deseja criar |

**Returns** um [Quizz](#quizz) com os seguintes parâmetros extras:
- **id**: id do quizz
- **key**: Chave secreta do quizz
<hr/>

### Editar quizz
```curl
  PUT /api/quizzes/${id}
```

| Parâmetro   | Tipo       |
| :---------- | :--------- | 
| `id`      | `string` |
| `data`      | [Quizz](#schema) |
| `Secret-Key` | `string` |

**Returns** o novo [Quizz](#quizz)
<hr/>

### Deletar quizz
```curl
  DELETE /api/quizzes/${id}
```

| Parâmetro   | Tipo       | 
| :---------- | :--------- | 
| `id`      | `string` | 
| `Secret-Key` | `string` |

**Returns** o [Quizz](#quizz) deletado

## Schemas
### Quizz
```json
{
  "title": "Título do quizz",
  "image": "https://http.cat/411.jpg",
  "questions": [
    {
      "title": "Título da pergunta 1",
      "color": "#123456",
      "answers": [
        {
          "text": "Texto da resposta 1",
          "image": "https://http.cat/411.jpg",
          "isCorrectAnswer": true
        },
        {
          "text": "Texto da resposta 2",
          "image": "https://http.cat/412.jpg",
          "isCorrectAnswer": false
        }
      ]
    },
    {
      "title": "Título da pergunta 2",
      "color": "#123456",
      "answers": [
        {
          "text": "Texto da resposta 1",
          "image": "https://http.cat/411.jpg",
          "isCorrectAnswer": true
        },
        {
          "text": "Texto da resposta 2",
          "image": "https://http.cat/412.jpg",
          "isCorrectAnswer": false
        }
      ]
    },
    {
      "title": "Título da pergunta 3",
      "color": "#123456",
      "answers": [
        {
          "text": "Texto da resposta 1",
          "image": "https://http.cat/411.jpg",
          "isCorrectAnswer": true
        },
        {
          "text": "Texto da resposta 2",
          "image": "https://http.cat/412.jpg",
          "isCorrectAnswer": false
        }
      ]
    }
  ],
  "levels": [
    {
      "title": "Título do nível 1",
      "image": "https://http.cat/411.jpg",
      "text": "Descrição do nível 1",
      "minValue": 0
    },
    {
      "title": "Título do nível 2",
      "image": "https://http.cat/412.jpg",
      "text": "Descrição do nível 2",
      "minValue": 50
    }
  ]
}
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `title`      | `string` | Título do quizz |
| `image` | `string` | URL da imagem |
| `questions`| `Array`<[Question](#question)> | Array com todas as perguntas |
| `levels` | `Array`<[Level](#level)> | Array com todos os níveis|

### Question
```json
{
  "title": "Título da pergunta 1",
  "color": "#123456",
  "answers": [
    {
      "text": "Texto da resposta 1",
      "image": "https://http.cat/411.jpg",
      "isCorrectAnswer": true
    },
    {
      "text": "Texto da resposta 2",
      "image": "https://http.cat/412.jpg",
      "isCorrectAnswer": false
    }
  ]
}
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `title`      | `string` | Título da pergunta |
| `color` | `string` | Cor do header da pergunta em hexadecimal (#000000) |
| `answers`| `Array`<[Answer](#answer)> | Array com todas as respostas possíveis |

### Answer
```json
{
  "text": "Texto da resposta 1",
  "image": "https://http.cat/411.jpg",
  "isCorrectAnswer": true
}
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `text`      | `string` | Texto da resposta |
| `image` | `string` | URL da imagem da resposta |
| `isCorrectAnswer`| `boolean` | É a resposta correta? |

### Level
```json
{
  "title": "Título do nível 1",
  "image": "https://http.cat/411.jpg",
  "text": "Descrição do nível 1",
  "minValue": 0
}
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `title`      | `string` | Título do nível |
| `image` | `string` | URL da imagem do nível |
| `text`| `string` | Descrição do nível |
| `minValue` | `integer` | Porcentagem mínima de acerto para o nível ser exibido |
