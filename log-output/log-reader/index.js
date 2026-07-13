const express = require("express");

const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const filePath = "/usr/src/app/files/log.txt";

const getStatus = () => {
    if (!fs.existsSync(filePath)) {
        return "No log yet";
    }

    return fs.readFileSync(filePath, "utf8");
};

app.get("/", (req, res) => {
    res.send(getStatus());
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

