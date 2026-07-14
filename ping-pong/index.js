const express = require("express");

const app = express();

const fs = require('fs');

const counterFile = '/usr/src/app/files/counter.txt';

const PORT = process.env.PORT || 3000;

let counter = 0;

app.get("/pingpong", (req, res) => {    

    if (fs.existsSync(counterFile)) {
    counter = Number(fs.readFileSync(counterFile, 'utf8')) || 0;
    }

    counter++;
    fs.writeFileSync(counterFile, String(counter));
    res.send(`Pong ${counter}`);
});

app.get("/pings", (req,res) => {
    res.send(`Pong ${counter}`);
}) 

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});