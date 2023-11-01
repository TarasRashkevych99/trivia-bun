//@ts-nocheck
import Elysia from "elysia";
import { getDatabase, updateDatabase, getTimestamp } from "./utils";

const assignment = new Elysia();

const database = await getDatabase();

// Update the question with the specified ID
assignment.put("/questions/:questionId", async (context) => {
    // parseInt() converts the questionId parameter from url to an integer
    // without checking if the parsing has been executed successfully.
    // In real case scenarios you should always check it
    let questionId = parseInt(context.params.questionId);

    // Get from the database the question with the specified questionId
    // Take a look at the example of the endpoint POST /questions/:questionId/answer
    // .....

    // If the question is not found, return a 404 status code and an error message
    // Look at the example of the endpoint POST /questions/:questionId/answer
    // .....

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

    // Update the question with the new values
    question.topic_id = body.topicId;
    question.question = body.question;
    question.answer1.text = body.answerA;
    // question.answer2.text = <get answerB from body>;
    // question.answer3.text = <get answerC from body>;
    // question.answer4.text = <get answerD from body>;
    question.correct_answer = body.correct_answer;
    question.date = getTimestamp();

    // Update the database
    // Look at the example of the endpoint POST /questions/:questionId/answer
    // .....

    // Set the correct status code and return an informative message
    // Look at the example of the endpoint POST /questions/:questionId/answer
    // .....
});

export default assignment;
