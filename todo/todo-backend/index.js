const express = require("express");
const { Pool } = require("pg");

const app = express();

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});

app.use(express.json());

const initializeDatabase = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL
        )
    `);

    console.log("Database initialized");
};

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

app.get("/todos", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT content
            FROM todos
            ORDER BY id
        `);

        const todos = result.rows.map(row => row.content);

        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

app.post("/todos", async (req, res) => {
    const todo = req.body.content;
    console.log(`Todo received: ${todo}`);

    if (!todo || todo.length > 140) {
        console.log(`Todo rejected: ${todo}`);
        return res.status(400).send("Todo must contain 1–140 characters");
    }

    try {
        await pool.query(
            `INSERT INTO todos (content) VALUES ($1)`,
            [todo]
        );

        console.log(`Todo saved: ${todo}`);
        res.status(201).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });

// app.listen(PORT, () => {
//     console.log(`Todo backend started on port ${PORT}`);
// });