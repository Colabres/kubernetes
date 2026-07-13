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

        res.send(`
            <h1>Todo Application</h1>
            <img src="/image" width="600" alt="Random image">
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