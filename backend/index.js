const express = require("express");
const fs = require("fs");

require('dotenv').config();
const app = express();

const path = process.env.VIDEOS_PATH

app.get("/videos", async (req, res) => {
    await fs.readdir(path, (err, files) => {
        if (err) {
            res.status(500).json({ message: "Váratlan hiba a szerveren." });
        }
        res.status(200).json(files)
    });
    return;
})


app.get("/video/:file", (req, res) => {
    const range = req.headers.range;
    const file = req.params.file;
    if (!range) {
        res.status(400).send("Range headere kötelező");
        return;
    }
    if (!file || file.split('.').length < 2 || file.split('.')[1] != "mp4") {
        res.status(400).json({ message: "Érvénytelen fájlnév." });
        return;
    }
    const videoPath = "sample.mkv";
    const videoSize = fs.statSync("sample.mkv").size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mkv",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});


app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`);
});