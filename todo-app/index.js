const express = require("express");

const app = express();

const fs = require("fs");

const imagePath = "/usr/src/app/files/image.jpg";
const cacheTime = 10 * 60 * 1000; 

const PORT = process.env.PORT || 3000;

const downloadImage = async () => {
    console.log("Downloading a new image");

    const response = await fetch("https://picsum.photos/1200");

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

        const todos = [
            "Learn Kubernetes basics",
            "Deploy application to cluster",
            "Configure persistent volumes"
        ];

        const todoItems = todos
            .map(todo => `<li>${todo}</li>`)
            .join("");

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

                <form>
                    <input
                        type="text"
                        maxlength="140"
                        placeholder="Enter a new todo (max 140 characters)"
                    >
                    <button type="button">Send</button>
                </form>

                <h2>Todos</h2>

                <ul>
                    ${todoItems}
                </ul>
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