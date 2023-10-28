//@ts-nocheck
import { Elysia } from "elysia";
import examples from "./examples";
import exercises from "./exercises";
import assignment from "./assignment";

const app = new Elysia();

app.use(examples)
    .use(exercises)
    .use(assignment)
    .get("/", () => "Hello from TriviaBun!");

app.listen(3000);

console.log(`TriviaBun is running at ${app.server?.hostname}:${app.server?.port}`);
