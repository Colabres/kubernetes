const fs = require("fs");

const id = Math.random().toString(36).substr(2);

const filePath = "/usr/src/app/files/log.txt";

const getStatus = () => {
    return `${new Date().toISOString()}: ${id}`;
};

const printLog = () => {
    const status = getStatus();
    console.log(status);
    fs.writeFileSync(filePath, status);
    setTimeout(printLog, 5000);
};

printLog();