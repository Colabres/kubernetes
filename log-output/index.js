const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

const id = Math.random().toString(36).substr(2);

const getStatus = () => {
    return `${new Date().toISOString()}: ${id}`;
};

const printLog = () => {
    console.log(getStatus());
    setTimeout(printLog, 5000);
};

app.get("/", (req, res) => {
    res.send(getStatus());
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

printLog();