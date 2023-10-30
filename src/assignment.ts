//@ts-nocheck
import Elysia from "elysia";
import { getDatabase, updateDatabase, getTimestamp } from "./utils";

const assignment = new Elysia();

const database = await getDatabase();

// Update the question with the specified ID
assignment.put("/questions/:questionId", async (context) => {
    // parseInt() converts the questionId parameter from url to an integer
    let questionId = parseInt(context.params.questionId);

    // Get from the database the question that has the same ID
    // as the questionId parameter (remember the find method)

    // If the question is not found, return a 404 status code and an error message

    // Check if the request body contains all the required fields
    const partialQuestion = {
        topicId: context.body?.topicId,
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

    // Update the question that you retrieved from the database with the new values (remember to set the date)

    // Update the database

    // Set the correct status code (the one normally used for responses with no body to successful PUT requests)
    // and return an informative message
});

export default assignment;
