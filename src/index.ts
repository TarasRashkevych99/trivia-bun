//@ts-nocheck
import { Elysia } from "elysia";

const DATABASE_PATH = "database.json";

const app = new Elysia()

app.get("/", () => "Hello Elysia");

app.get("/questions", async (context) => {
  const dbFile = Bun.file(DATABASE_PATH);
  const database = await dbFile.json();
  
  return database.questions
})

app.get("/questions/:questionId", async (context) => {
  const dbFile = Bun.file(DATABASE_PATH);
  const database = await dbFile.json();
  
  const question = database.questions.find(question => {
    return question.id == context.params.questionId
  })

  return question
})

app.post("/questions/:questionId/answer", async (context) => {
  const dbFile = Bun.file(DATABASE_PATH);
  const database = await dbFile.json();
  
  const question = database.questions.find(question => {
    return question.id == context.params.questionId
  })

  // Manca da creare e caricare nel database l'oggetto risposta.
  // Ricordarsi anche di passare l'utende in qualche modo (dal body è il meno peggio)
  // *credo sia meglio inserire un campo "isCorrect" in tutte le risposte e poi ritornare quello*

  return question.correct_answer === context.body.questionId
})

// fare la put che cambia il nickname del player

app.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
