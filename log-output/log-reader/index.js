const express = require("express");

const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const filePath = "/usr/src/app/files/log.txt";
const counterFile = '/usr/src/app/files/counter.txt';

const getStatus = () => {
    const log = fs.existsSync(filePath)
    ? fs.readFileSync(filePath,"utf8")
    :  "No log yet" ;

    const counter = fs.existsSync(counterFile)
    ? fs.readFileSync(counterFile,"utf8")
    : "0"

    return `${log}\nPing / Pongs: ${counter}`;
};

app.get("/", (req, res) => {
    res.send(getStatus());
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

