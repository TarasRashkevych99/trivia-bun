//@ts-nocheck
import { Elysia } from "elysia";
import { getDatabase, updateDatabase, getTimestamp, PLAYER_ID} from "./utils";

const app = new Elysia();

const database = await getDatabase();

app.get("/", () => "Hello from TriviaBun!");


//===== Examples =====//

app.get("/questions", async (context) => {
  // Return all questions
  return database.questions; // implicit 200 status code
})


app.get("/questions/:questionId", async (context) => {
  // parseInt() converts the questionId parameter from url to an integer
  let questionId = parseInt(context.params.questionId);

  // find() returns the first question that satisfies the condition
  const question = database.questions.find(question => {
    return question.id === questionId;
  })

  // If the question is not found, return a 404 status code and a message
  if (!question) {
    context.set.status = 404;
    return "Question not found";
  }

  return question; // implicit 200 status code
})


app.post("/questions/:questionId/answer", async (context) => {
  // parseInt() converts the questionId parameter from url to an integer
  let questionId = parseInt(context.params.questionId);
  // find() returns the first question that satisfies the condition
  const question = database.questions.find(question => question.id === questionId)

  // If the question is not found, return a 404 status code and a message
  if (!question) {
    context.set.status = 404;
    return "Question not found";
  }

  // find() returns the first answer that satisfies the condition
  const answer = database.answers.find(answer =>
    answer.question_id === question.id && 
    answer.player_id === PLAYER_ID
  );

  // If the player has already answered this question, return a 400 status code and a message
  if (answer) {
    context.set.status = 400;
    return "You have already answered this question";
  }

  // If the player has not answered this question, add the answer to the database
  const answerObj = {
    player_id: PLAYER_ID,
    question_id: question.id,
    answer: context.body.answer, // context.body.answer is the answer passed in the request body
    date: getTimestamp()
  };


  database.answers.push(answerObj);

  await updateDatabase(database);

  return question.correct_answer === answerObj.answer; // implicit 200 status code
})


app.put("/players/:playerId/nickname", async (context) => {
  // parseInt() converts the playerId parameter from url to an integer
  let playerId = parseInt(context.params.playerId);

  // find() returns the first player that satisfies the condition
  const player = database.player.find(player => {
    return player.player_id === playerId;
  })

  // If the player is not found, return a 404 status code and a message
  if (!player) {
    context.set.status = 404;
    return "Player not found";
  }

  const name = context.body?.nickname; // context.body.nickname is the nickname passed in the request body

  // If the name is not passed in the body, return a 400 status code and a message
  if (!name) {
    context.set.status = 400;
    return "Nickname not found";
  }

  player.nickname = name;
  player.date = getTimestamp()

  await updateDatabase(database);
  
  context.set.status = 204;
})

//===== Exercises =====//

app.get("/questions/topics", async (context) => {
  // Return all topics
  return database.topics; // implicit 200 status code
})


app.get("/questions/topics/:topicId", async (context) => {
  // parseInt() converts the topicId parameter from url to an integer
  let topicId = parseInt(context.params.topicId);

  // filter() returns all questions that belong to the topic
  const questions = database.questions.filter(question => {
    return question.topic_id === topicId;
  })

  return questions; // implicit 200 status code
})


app.post("/questions", async (context) => {
  // Create a new question ID by adding 1 to the ID of the last question
  const newId = database.questions[database.questions.length - 1].id + 1;

  // Check if the request body contains all the required fields
  const partialQuestion = {
    question: context.body?.question,
    answerA: context.body?.answerA,
    answerB: context.body?.answerB,
    answerC: context.body?.answerC,
    answerD: context.body?.answerD,
    correct_answer: context.body?.correct_answer,
    points: context.body?.points,
  };

  // If any of the fields are undefined, return a 400 status code and a message
  if (Object.values(partialQuestion).includes(undefined)) {
    context.set.status = 400;
    return "Invalid question";
  }

  // Create a new question object
  const newQuestion = {
    id: newId,
    topic_id: 0,
    question: partialQuestion.question,
    answer1: {
      text: partialQuestion.answerA,
      id: "A"
    },
    answer2: {
      text: partialQuestion.answerB,
      id: "B"
    },
    answer3: {
      text: partialQuestion.answerC,
      id: "C"
    },
    answer4: {
      text: partialQuestion.answerD,
      id: "D"
    },
    correct_answer: partialQuestion.correct_answer,
    points: partialQuestion.points,
    date: getTimestamp()
  };

  database.questions.push(newQuestion);

  await updateDatabase(database);

  context.set.status = 201;
})

//===== Assignment =====//

app.put("/questions/:questionId", async (context) => {
  // parseInt() converts the questionId parameter from url to an integer
  let questionId = parseInt(context.params.questionId);
  
  const question = database.questions.find(question => {
    return question.id === questionId;
  })

  // If the question is not found, return a 404 status code and a message
  if (!question) {
    context.set.status = 404;
    return "Question not found";
  }

  // Check if the request body contains all the required fields
  const partialQuestion = {
    topicId: context.body?.topicId,
    question: context.body?.question,
    answerA: context.body?.answerA,
    answerB: context.body?.answerB,
    answerC: context.body?.answerC,
    answerD: context.body?.answerD,
    correct_answer: context.body?.correct_answer,
    points: context.body?.points
  };

  // If any of the fields are undefined, return a 400 status code and a message
  if (Object.values(partialQuestion).includes(undefined)) {
    context.set.status = 400;
    return "Invalid question";
  }

  // Update the question object
  question.topic_id = partialQuestion.topicId;
  question.question = partialQuestion.question;
  question.answer1.text = partialQuestion.answerA;
  question.answer2.text = partialQuestion.answerB;
  question.answer3.text = partialQuestion.answerC;
  question.answer4.text = partialQuestion.answerD;
  question.correct_answer = partialQuestion.correct_answer;
  question.points = partialQuestion.points;
  question.date = getTimestamp();
  
  await updateDatabase(database);

  context.set.status = 204;
})

app.listen(3000);

console.log(
  `TriviaBun is running at ${app.server?.hostname}:${app.server?.port}`
);
