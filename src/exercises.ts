//@ts-nocheck
import Elysia from "elysia";
import { getDatabase, updateDatabase, getTimestamp } from "./utils";

const exercises = new Elysia();

const database = await getDatabase();

// Return all topics
exercises.get("/topics", async (context) => {
    // write code here
});

// Return all questions that belong to the topic with the topicId
exercises.get("/topics/:topicId/questions", async (context) => {
    // parseInt() converts the topicId parameter from url to an integer
    let topicId = parseInt(context.params.topicId);

    // get all questions that belong to the topic with the topicId (remember the filter method)

    // return the questions
});

// Create a new question
exercises.post("/questions", async (context) => {
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
    };

    // If any of the fields are undefined, return a 400 status code and a message
    if (Object.values(partialQuestion).includes(undefined)) {
        context.set.status = 400;
        return "Invalid question";
    }

    // Create a new question object that uses partialQuestion and matches
    // the structure of the questions in the database

    // Add the new question to the set of questions in the database

    // Update the database

    // Set the correct status code (the one normally used for responses with no body to successful PUT requests)
    // and return an informative message
});

export default exercises;
