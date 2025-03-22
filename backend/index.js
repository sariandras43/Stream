const express = require("express");
const fs = require("fs");

require('dotenv').config();
const app = express();

const path = process.env.VIDEOS_PATH;
const port = process.env.port;

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
    const acceptedExtensions = ["mp4","mkv"]
    if (!range) {
        res.status(400).send("Range header kötelező");
        return;
    }
    let fileNameSplit;
    if (!file) {
        res.status(400).json({ message: "Érvénytelen fájlnév." });
        return;
    }else{
        fileNameSplit = file.split('.');
        if (fileNameSplit.length<2 || !acceptedExtensions.includes(fileNameSplit[fileNameSplit.length-1])) {
            res.status(400).json({ message: "Érvénytelen kiterjesztés." });  
            return;   
        }
    }
    const videoPath = path + '/' + file;
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": `video/${fileNameSplit[fileNameSplit.length-1]}`,
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});


app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});