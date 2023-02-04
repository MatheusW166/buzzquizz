[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/MatheusW166/buzzquizz/blob/main/LICENCE)

<div align="center">
<p>| <a href="#about">About</a> | <a href="#authors">Authors</a> | <a href="#features">Features</a> | <a href="#screenshots">Screenshots</a> | <a href="#stack">Stack</a> | <a href="#api">API</a> | <a href="#schemas">Schemas</a> |</p>
</div>

# BuzzQuizz
This is a quiz app made as part of evaluation of Driven Education full-stack web course.

Link to access the application:
- [BuzzQuizz](https://matheusw166.github.io/buzzquizz/)

## About
The application allows the user to play question and answer quizzes. User-created quizzes are saved locally and can be edited and deleted. Quizzes have at least three questions with one right answer and up to three wrong answers, and at least two levels, which will be displayed to the user at the end of the game indicating their placement according to the number of correct answers marked.

## Authors
- [@MatheusW166](https://github.com/MatheusW166)
- [@RobertaCapalbo](https://github.com/RobertaCapalbo)
- [@Tundror](https://github.com/Tundror)

## Features

- Play quizzes
- Create, edit and delete quizzes
- Desktop mode
- Mobile mode
- Responsive

## Screenshots
![Home no Quizz](https://github.com/MatheusW166/buzzquizz/blob/main/refs/home.png)
![Home](https://github.com/MatheusW166/buzzquizz/blob/main/refs/home_local_quizzes.png)
![Quizz](https://github.com/MatheusW166/buzzquizz/blob/main/refs/quizz.png)
![Result](https://github.com/MatheusW166/buzzquizz/blob/main/refs/quizz_result.png)
![Creation](https://github.com/MatheusW166/buzzquizz/blob/main/refs/creating_quizz_1.png)

## Stack
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) ![Trello](https://img.shields.io/badge/Trello-%23026AA7.svg?style=for-the-badge&logo=Trello&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) 

## API
The project uses [Driven Education's](https://www.driven.com.br/) public API.

### Get the fifty most recent quizzes
```curl
  GET /api/quizzes
```
**Returns** an array of [Quizz](#quizz)
<hr/>

### Get a quizz by id
```curl
  GET /api/quizzes/${id}
```
| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Required**. The ID of the quizz you want |

**Returns** a [Quizz](#quizz)
<hr/>

### Create a quizz
```curl
  POST /api/quizzes
```
| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `data`      | [Quizz](#quizz) | **Required**. The quizz object you want to create |

**Returns** a [Quizz](#quizz) with the following extra parameters:
- **id**: Quizz id
- **key**: Secret key of the quizz
<hr/>

### Edit quizz
```curl
  PUT /api/quizzes/${id}
```

| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Required**. The ID of the quizz you want to edit |
| `data`      | [Quizz](#schema) | **Required**. The quizz object that will replace the old one |
| `Secret-Key` | `string` | **Required**. The key returned in creation |

**Returns** the new [Quizz](#quizz)
<hr/>

### Delete quizz
```curl
  DELETE /api/quizzes/${id}
```

| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Required**. The ID of the quizz you want to delete |
| `Secret-Key` | `string` | **Required**. The key returned in creation |

**Returns** the deleted [Quizz](#quizz)

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
| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `title`      | `string` | The quizz title |
| `image` | `string` | An URL to the quizz image |
| `questions`| `Array`<[Question](#question)> | Array with all questions of the quizz|
| `levels` | `Array`<[Level](#level)> | Array with all levels of the quizz|

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
| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `title`      | `string` | Title of the question |
| `color` | `string` | The question header color in hexadecimal (#000000) |
| `answers`| `Array`<[Answer](#answer)> | Array with all possible answers |

### Answer
```json
{
  "text": "Texto da resposta 1",
  "image": "https://http.cat/411.jpg",
  "isCorrectAnswer": true
}
```
| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `text`      | `string` | Text of the answer |
| `image` | `string` | An image URL |
| `isCorrectAnswer`| `boolean` | whether the answer is correct or not |

### Level
```json
{
  "title": "Título do nível 1",
  "image": "https://http.cat/411.jpg",
  "text": "Descrição do nível 1",
  "minValue": 0
}
```
| Parameter   | Type       | Description                                   |
| :---------- | :--------- | :------------------------------------------ |
| `title`      | `string` | Title of the level |
| `image` | `string` | Level image URL |
| `text`| `string` | The level description |
| `minValue` | `integer` | Minimum hit percentage for the level to be displayed |
