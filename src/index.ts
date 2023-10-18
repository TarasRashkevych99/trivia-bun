//@ts-nocheck
import { Elysia } from "elysia";

async function getDatabase() {
  const dbFile = Bun.file(DATABASE_PATH);
  return await dbFile.json();
}

const DATABASE_PATH = "database.json";
const PLAYER_ID = 0;

const app = new Elysia();

const database = await getDatabase();

app.get("/", () => "Hello from TriviaBun!");


app.get("/questions", async (context) => {
  return database.questions;
})


app.get("/questions/:questionId", async (context) => {
  let questionId = parseInt(context.params.questionId);
  const question = database.questions.find(question => {
    return question.id === questionId;
  })

  return question;
})


app.post("/questions/:questionId/answer", async (context) => {
  const dbFile = Bun.file(DATABASE_PATH);

  const question = database.questions.find(question => {
    return question.id == context.params.questionId;
  })

  if (!question) {
    return "Question not found";
  }

  const answerObj = {
    player_id: PLAYER_ID,
    question_id: question.id,
    answer: context.body.myAnswer
  };

  database.answers.push(answerObj);

  const updatedJson = JSON.stringify(database, null, 4);
  await Bun.write(dbFile, updatedJson);

  return question.correct_answer === answerObj.answer;
})


app.put("/players/:playerId/nickname", async (context) => {
  const dbFile = Bun.file(DATABASE_PATH);

  const name = context.body.nickname;
  const player = database.player.find(player => {
    return player.player_id == context.params.playerId;
  })

  if (name && player){
    player.nickname = name;

    const updatedJson = JSON.stringify(database, null, 4);
    await Bun.write(dbFile, updatedJson);
    
    return "Nickname Updated";
  } else {
    return "Error";
  }
})

// Exercises
// GET /questions/topics
app.get("/questions/topics", async (context) => {
  return database.topics;
})


// GET /questions/topics/{topicId}
app.get("/questions/topics/:topicId", async (context) => {
  let topicId = parseInt(context.params.topicId);
  const topic = database.topics.filter(topic => {
    return topic.id == topicId;
  })

  return topic;
})


// POST /questions
app.post("/questions", async (context) => {
  const dbFile = Bun.file(DATABASE_PATH);
  const new_id = database.questions[database.questions.length - 1].id + 1;

  const b = context.body;
  if(b.question && b.answerA && b.answerB && b.answerC && b.answerD && b.correct_answer && b.points){

    const new_question = {
      id: new_id,
      topic_id: 0,
      question: b.question,
      answer1: {
        text: b.answerA,
        id: "A"
      },
      answer2: {
        text: b.answerB,
        id: "B"
      },
      answer3: {
        text: b.answerC,
        id: "C"
      },
      answer4: {
        text: b.answerD,
        id: "D"
      },
      correct_answer: b.correct_answer,
      points: b.points
    };

    database.questions.push(new_question);

    const updatedJson = JSON.stringify(database, null, 4);
    await Bun.write(dbFile, updatedJson);

    return true;
  } else {
    return false;
  }
})


// Assignment
app.put("/questions/:questionId", async (context) => {
  const dbFile = Bun.file(DATABASE_PATH);
  const question = database.questions.find(question => {
    return question.id == context.params.questionId;
  })

  const b = context.body;
  if (b.topic_id) question.topic_id = b.topic_id;
  if (b.question) question.question = b.question;
  if (b.answerA) question.answer1.text = b.answerA;
  if (b.answerB) question.answer2.text = b.answerB;
  if (b.answerC) question.answer3.text = b.answerC;
  if (b.answerD)question.answer4.text = b.answerD;
  if (b.correct_answer) question.correct_answer = b.correct_answer;
  if (b.points) question.points = b.points;
  
  const updatedJson = JSON.stringify(database, null, 4);
  await Bun.write(dbFile, updatedJson);

})

app.listen(3000);

console.log(
  `TriviaBun is running at ${app.server?.hostname}:${app.server?.port}`
);
