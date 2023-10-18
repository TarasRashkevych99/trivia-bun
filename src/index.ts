//@ts-nocheck
import { Elysia } from "elysia";
import { type } from "os";

async function getDatabase() {
  const dbFile = Bun.file(DATABASE_PATH);
  return await dbFile.json();
}

const DATABASE_PATH = "database.json";
const PLAYER_ID = 0;

const app = new Elysia()

const database = await getDatabase()

app.get("/", () => "Hello Elysia");

app.get("/questions", async (context) => {
  return database.questions
})

app.get("/questions/:questionId", async (context) => {
  let questionId = parseInt(context.params.questionId)
  const question = database.questions.find(question => {
    return question.id === questionId
  })

  return question
})

app.post("/questions/:questionId/answer", async (context) => {
  const question = database.questions.find(question => {
    return question.id == context.params.questionId
  })

  if (!question) {
    return "Question not found"
  }

  const answer = {
    player_id: PLAYER_ID,
    question_id: question.id,
    answer: context.body.answer
  }

  database.answers.push(answer)
  
  // Manca da creare e caricare nel database l'oggetto risposta.
  // Ricordarsi anche di passare l'utende in qualche modo (dal body è il meno peggio)
  // *credo sia meglio inserire un campo "isCorrect" in tutte le risposte e poi ritornare quello*

  return question.correct_answer === context.body.myAnswer
})

// fare la put che cambia il nickname del player
app.put("/players/:playerId/nickname", async (context) => {
  const name = context.body.nickname;
  const dbFile = Bun.file(DATABASE_PATH);
  const player = database.player.find(player => {
    return player.player_id == context.params.playerId
  })

  if (name && player){
    player.nickname = name;
    const updatedJson = JSON.stringify(database, null, 4);
    await Bun.write(dbFile, updatedJson)
    
    return "Nickname Updated";
  }else{
    return "Error"
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

  const questions = database.questions.filter(question => {
    return question.topic_id == topicId;
  })

  return questions;
})

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
