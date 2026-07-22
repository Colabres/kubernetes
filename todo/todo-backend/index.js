const express = require("express");
const { Pool } = require("pg");
const { connect, StringCodec } = require("nats");

const app = express();

const PORT = process.env.PORT || 3000;

const NATS_URL =
    process.env.NATS_URL ||
    "nats://my-nats.nats.svc.cluster.local:4222";

const NATS_SUBJECT = "todos.events";

let natsConnection;

const stringCodec = StringCodec();

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
            content TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        )
    `);

    console.log("Database initialized");
};

const connectToNats = async () => {
    natsConnection = await connect({
        servers: NATS_URL
    });

    console.log(`Connected to NATS at ${NATS_URL}`);
};

const publishTodoEvent = (event) => {
    if (!natsConnection) {
        console.error("Cannot publish: NATS is not connected");
        return;
    }

    natsConnection.publish(
        NATS_SUBJECT,
        stringCodec.encode(JSON.stringify(event))
    );

    console.log(`Published NATS event: ${event.type}`);
};

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

app.get("/todos", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id,content,done
            FROM todos
            ORDER BY id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

app.put("/todos/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).send("Invalid todo id");
        }

        const result = await pool.query(
            `
            UPDATE todos
            SET done = TRUE
            WHERE id = $1
            RETURNING id, content, done
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Todo not found");
        }

        const updatedTodo = result.rows[0];

        publishTodoEvent({
            type: "todo.updated",
            message: `Todo marked as done: ${updatedTodo.content}`,
            todo: updatedTodo
        });

        res.json(updatedTodo);
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
        const result = await pool.query(
            `
            INSERT INTO todos (content)
            VALUES ($1)
            RETURNING id, content, done
            `,
            [todo]
        );

        const createdTodo = result.rows[0];

        publishTodoEvent({
            type: "todo.created",
            message: `Todo created: ${createdTodo.content}`,
            todo: createdTodo
        });

        console.log(`Todo saved: ${todo}`);
        res.status(201).json(createdTodo);
    } catch (error) {
        console.error(error);
        res.status(500).send("Database error");
    }
});

app.get("/ready", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).send("Ready");
    } catch (error) {
        console.error("Readiness check failed:", error.message);

        res.status(503).send("Database unavailable");
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

    initializeDatabase()
        .catch((error) => {
            console.error(
                "Database initialization failed:",
                error.message
            );
        });

    connectToNats()
        .catch((error) => {
            console.error(
                "NATS connection failed:",
                error.message
            );
        });
});


