const express = require("express");

const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const filePath = "/usr/src/app/files/log.txt";
const counterFile = '/usr/src/app/files/counter.txt';
const infoFilePath ="/usr/src/app/config/information.txt"
const message = process.env.message
const id = Math.random().toString(36).substr(2); //remove after task 2.1

const getStatus = async () => {
    // const log = fs.existsSync(filePath)
    // ? fs.readFileSync(filePath,"utf8")
    // :  "No log yet" ;

    // const counter = fs.existsSync(counterFile)
    // ? fs.readFileSync(counterFile,"utf8")
    // : "0"

    const content = fs.existsSync(infoFilePath)
    ? fs.readFileSync(infoFilePath,"utf8")
    :  "No text yet" ;

    const response = await fetch("http://ping-pong-svc:2345/pings");
    const counter = await response.text();
    
    const log = `${new Date().toISOString()}: ${id}`;
    

    return `file content: ${content}
    env variable: MESSAGE=${message}
    ${log}.
    Ping / Pongs: ${counter}`;
};

app.get("/", async (req, res) => {
    const status = await getStatus();
    res.type("text/plain").send(status);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

