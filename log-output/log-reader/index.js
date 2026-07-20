const express = require("express");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const filePath = "/usr/src/app/files/log.txt";
const infoFilePath = "/usr/src/app/config/information.txt";
const message = process.env.message;

const getStatus = async () => {
    const log = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, "utf8")
        : "No log yet";

    const content = fs.existsSync(infoFilePath)
        ? fs.readFileSync(infoFilePath, "utf8")
        : "No text yet";

    const response = await fetch(
        "http://ping-pong-svc:2345/pings"
    );

    if (!response.ok) {
        throw new Error(
            `Ping-pong returned status ${response.status}`
        );
    }

    const counter = await response.text();

    return `file content: ${content}
env variable: MESSAGE=${message}
${log}
Ping / Pongs: ${counter}`;
};

app.get("/ready", async (req, res) => {
    try {
        const response = await fetch(
            "http://ping-pong-svc:2345/ready"
        );

        if (!response.ok) {
            return res
                .status(503)
                .send("Ping-pong unavailable");
        }

        res.status(200).send("Ready");
    } catch (error) {
        console.error(
            "Readiness check failed:",
            error.message
        );

        res.status(503).send("Ping-pong unavailable");
    }
});

app.get("/", async (req, res) => {
    try {
        const status = await getStatus();

        res.type("text/plain").send(status);
    } catch (error) {
        console.error(
            "Getting status failed:",
            error.message
        );

        res.status(500).send("Ping-pong unavailable");
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});