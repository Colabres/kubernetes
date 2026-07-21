const express = require("express");

const app = express();

const fs = require("fs");

const imagePath = "/usr/src/app/files/image.jpg";
const cacheTime = process.env.cacheTime; 

const PORT = process.env.PORT || 3000;

const downloadImage = async () => {
    console.log("Downloading a new image");
    const IMAGE_URL = process.env.IMAGE_URL;
    const response = await fetch(IMAGE_URL);

    if (!response.ok) {
        throw new Error(`Image download failed: ${response.status}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(imagePath, imageBuffer);

    console.log("Image saved to persistent volume");
};

const imageNeedsRefresh = () => {
    if (!fs.existsSync(imagePath)) {
        return true;
    }

    const imageInfo = fs.statSync(imagePath);
    const imageAge = Date.now() - imageInfo.mtimeMs;

    return imageAge >= cacheTime;
};

let isHealthy = true;



app.get("/healthz", (req, res) => {
    if (!isHealthy) {
        return res.status(500).json({
            status: "unhealthy"
        });
    }

    res.status(200).json({
        status: "ok"
    });
});

app.post("/break", (req, res) => {
    console.log("BREAK endpoint called");
    isHealthy = false;

    res.status(200).json({
        status: "broken"
    });
});


app.get("/image", (req, res) => {
    if (!fs.existsSync(imagePath)) {
        return res.status(404).send("Image not found");
    }

    res.sendFile(imagePath);
});

app.get("/", async (req, res) => {
    try {
        if (imageNeedsRefresh()) {
            await downloadImage();
        }

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Todo App</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 40px auto;
                        text-align: center;
                    }

                    img {
                        width: 300px;
                        max-height: 300px;
                        object-fit: cover;
                    }

                    form {
                        margin: 30px 0;
                    }

                    input {
                        width: 70%;
                        padding: 10px;
                    }

                    button {
                        padding: 10px 20px;
                    }

                    ul {
                        padding: 0;
                        list-style: none;
                        text-align: left;
                    }

                    li {
                        padding: 15px;
                        margin: 10px 0;
                        border: 1px solid #ddd;
                    }
                </style>
            </head>

            <body>
                <h1>Todo App</h1>

                <img src="/image" alt="Random image">

                <form id="todo-form">
                    <input
                        id="todo-input"
                        type="text"
                        maxlength="140"
                        placeholder="Enter a new todo (max 140 characters)"
                        required
                    >
                    <button type="submit">Send</button>
                </form> 
                

                <h2>Todos</h2>


                <ul id="todo-list"></ul>
                <button id="break-button" type="button">
                    Break app
                </button>
                <script>
                    const form = document.getElementById("todo-form");
                    const input = document.getElementById("todo-input");
                    const todoList = document.getElementById("todo-list");

                const loadTodos = async () => {
                    const response = await fetch("/todos");

                    if (!response.ok) {
                        console.error("Failed to load todos");
                        return;
                    }

                    const todos = await response.json();

                    todoList.innerHTML = "";

                    todos.forEach(todo => {
                        const item = document.createElement("li");

                        const text = document.createElement("span");
                        text.textContent = todo.content;

                        if (todo.done) {
                            text.style.textDecoration = "line-through";
                        }

                        const button = document.createElement("button");
                        button.textContent = todo.done ? "Done" : "Mark done";
                        button.disabled = todo.done;

                        button.addEventListener("click", async () => {
                            const response = await fetch("/todos/" + todo.id, {
                                method: "PUT"
                            });

                            if (!response.ok) {
                                console.error("Failed to update todo");
                                return;
                            }

                            await loadTodos();
                        });

                        item.appendChild(text);
                        item.appendChild(button);

                        todoList.appendChild(item);
                    });
                };

                    form.addEventListener("submit", async event => {
                        event.preventDefault();

                        await fetch("/todos", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                content: input.value
                            })
                        });

                        input.value = "";

                        await loadTodos();
                    });

                    loadTodos();

                    const breakButton = document.getElementById("break-button");

                    breakButton.addEventListener("click", async () => {
                        const response = await fetch("/break", {
                            method: "POST"
                        });

                        if (response.ok) {
                            document.body.innerHTML =
                                '<div style="' +
                                    'font-family: Arial, sans-serif;' +
                                    'text-align: center;' +
                                    'background: #fde5e5;' +
                                    'min-height: 100vh;' +
                                    'padding-top: 80px;' +
                                    'color: #9d2020;' +
                                '">' +
                                    '<h1 style="font-size: 56px;">System Failure</h1>' +
                                    '<p style="font-size: 28px;">' +
                                        'The Todo App is currently unhealthy. ' +
                                        'Please wait for recovery.' +
                                    '</p>' +
                                '</div>';
                        }
                    });
                </script>

            </body>
            </html>
        `);
    } catch (error) {
        console.error(error);

        res.status(500).send(`
            <h1>Todo Application</h1>
            <p>Could not load the image.</p>
        `);
    }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// some comment