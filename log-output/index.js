
const id = Math.random().toString(36).substr(2);

const printLog = () => {
    
    console.log(`${new Date().toISOString()}: ${id}`);

    setTimeout(printLog, 5000);
}

printLog();     