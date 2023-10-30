//@ts-nocheck
import Elysia from "elysia";
import { getDatabase, updateDatabase, getTimestamp, PLAYER_ID } from "./utils";

const examples = new Elysia();

const database = await getDatabase();

examples.get("/questions", async (context) => {
    // Return all questions
    return database.questions; // implicit 200 status code
});

examples.get("/questions/:questionId", async (context) => {
    // parseInt() converts the questionId parameter from url to an integer
    let questionId = parseInt(context.params.questionId);

    // find() returns the first question that has the same ID as the questionId parameter
    const question = database.questions.find((question) => question.id === questionId);

    // If the question is not found, return a 404 status code and a message
    if (!question) {
        context.set.status = 404;
        return "Question not found";
    }

    return question; // implicit 200 status code
});

examples.post("/questions/:questionId/answer", async (context) => {
    // parseInt() converts the questionId parameter from url to an integer
    let questionId = parseInt(context.params.questionId);
    // find() returns the first question that has the same ID as the questionId parameter
    const question = database.questions.find((question) => question.id === questionId);

    // If the question is not found, return a 404 status code and a message
    if (!question) {
        context.set.status = 404;
        return "Question not found";
    }

    // find() returns the first answer that has the same question_id and player_id
    // as the questionId parameter and the PLAYER_ID constant
    const answer = database.answers.find(
        (answer) => answer.question_id === question.id && answer.player_id === PLAYER_ID
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
        date: getTimestamp(),
    };

    database.answers.push(answerObj);

    const player = database.player.find((player) => player.id === PLAYER_ID);

    // If the player is not found, return a 404 status code and a message
    if (!player) {
        context.set.status = 404;
        return "Player not found";
    } else {
        let res;
        if (question.correct_answer === answerObj.answer) {
            res = `Correct answer!`; // implicit 200 status code
        } else {
            res = "Incorrect answer! Try with the next one"; // implicit 200 status code
        }
        await updateDatabase(database);
        return res;
    }
});

examples.put("/players/:playerId/nickname", async (context) => {
    // parseInt() converts the playerId parameter from url to an integer
    let playerId = parseInt(context.params.playerId);

    // find() returns the first player that satisfies the condition
    const player = database.player.find((player) => player.id === playerId);

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
    player.date = getTimestamp();

    await updateDatabase(database);

    context.set.status = 204;
    return "Nickname changend successfully";
});

export default examples;
