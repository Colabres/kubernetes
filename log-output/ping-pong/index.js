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

const initializeDatabase = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS ping_pong_counter (
            id INTEGER PRIMARY KEY,
            counter INTEGER NOT NULL
        )
    `);

    await pool.query(`
        INSERT INTO ping_pong_counter (id, counter)
        VALUES (1, 0)
        ON CONFLICT (id) DO NOTHING
    `);

    console.log("Database initialized");
};



app.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            UPDATE ping_pong_counter
            SET counter = counter + 1
            WHERE id = 1
            RETURNING counter
        `);

        const counter = result.rows[0].counter;

        res.send(`Pong ${counter}`);
    } catch (error) {
        console.error("Counter update failed:", error);
        res.status(500).send("Database error");
    }
});

app.get("/pings", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT counter
            FROM ping_pong_counter
            WHERE id = 1
        `);

        const counter = result.rows[0].counter;

        res.send(`Pong ${counter}`);
    } catch (error) {
        console.error("Counter read failed:", error);
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