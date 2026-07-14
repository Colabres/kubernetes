const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

const todos = [
    "Learn Kubernetes basics",
    "Deploy application to cluster",
    "Configure persistent volumes"
];

app.get("/todos", (req, res) => {
    res.json(todos);
});

app.post("/todos", (req, res) => {
    const todo = req.body.content;

    if (!todo || todo.length > 140) {
        return res.status(400).send("Todo must contain 1–140 characters");
    }

    todos.push(todo);

    res.status(201).json(todo);
});

app.listen(PORT, () => {
    console.log(`Todo backend started on port ${PORT}`);
});