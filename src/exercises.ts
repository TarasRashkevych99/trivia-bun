//@ts-nocheck
import Elysia from "elysia";
import { getDatabase, updateDatabase, getTimestamp } from "./utils";

const exercises = new Elysia();

const database = await getDatabase();

// Return all topics
exercises.get("/topics", (context) => {
    // Take a look at the example of the endpoint GET /questions
    // .....
});

// Return all questions that belong to the topic with the topicId
exercises.get("/topics/:topicId/questions", async (context) => {
    // parseInt() converts the topicId parameter from url to an integer
    // without checking if the parsing has been executed successfully.
    // In real case scenarios you should always check it
    let topicId = parseInt(context.params.topicId);

    // Get from the database the topic with the specified topicId (use the find() method as
    // in the example of the endpoint GET /questions/:questionId)
    // .....

    // If the topic is not found, return a 404 status code and a message (look at the example of the
    // endpoint GET /questions/:questionId)
    // .....

    // The filter() method is similar to the find() method used in the examples but it returns multiple
    // elements that satisfy a particular condition. In this case it should return all thoose questions
    // that have the topic_id equal to the topicId. The question object inside the filter method has
    // the field topic_id so, based on the conditions passed to the find() method in the examples, write
    // the correct condition.

    // const questions = database.questions.filter((question) => <put here the condition>);

    // return the questions
    // .....
});

// Create a new question
exercises.post("/questions", async (context) => {
    // Creates a new question ID by adding 1 to the ID of the last question
    const newId = database.questions[database.questions.length - 1].id + 1;

    // Check if the request body contains all the required fields
    const body = {
        topicId: context.body?.topicId,
        question: context.body?.question,
        answerA: context.body?.answerA,
        answerB: context.body?.answerB,
        answerC: context.body?.answerC,
        answerD: context.body?.answerD,
        correct_answer: context.body?.correct_answer,
    };

    // If any of the fields are undefined, return a 400 status code and a message
    if (Object.values(body).includes(undefined)) {
        context.set.status = 400;
        return "Invalid question";
    }

    // Create a new question object that uses partialQuestion
    const newQuestion = {
        // id: <put here the id of the new question>,
        topic_id: body.topicId,
        question: body.question,
        answer1: {
            text: body.answerA,
            id: "A",
        },
        answer2: {
            text: body.answerB,
            id: "B",
        },
        answer3: {
            text: body.answerC,
            id: "C",
        },
        answer4: {
            text: body.answerD,
            id: "D",
        },
        correct_answer: body.correct_answer,
        date: getTimestamp(),
    };

    // Insert the new question into the database
    // Take a look at the example of the endpoint POST /questions/:questionId/answer
    // .....

    // Update the database
    // Take a look at the example of the endpoint POST /questions/:questionId/answer
    // .....

    // Set the correct status code and return an informative message
    // Take a look at the example of the endpoint POST /questions/:questionId/answer
    // .....
});

export default exercises;
