const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const ffmpeg = require("fluent-ffmpeg");

require("dotenv").config();
const app = express();

const directoryPath = process.env.VIDEOS_PATH;
const port = process.env.port;

const publicFolderPath = path.join(__dirname, "public");
const acceptedExtensions = ["mp4", "ogg", "webm"];

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/videos", async (req, res) => {
    await fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).json({ message: "Váratlan hiba a szerveren." });
        }
        const videoFiles = files.filter((f) =>
            acceptedExtensions.includes(f.split(".")[f.split(".").length - 1])
        );

        console.log(directoryPath);
        const thumbnails = videoFiles.map((file) => {
            const filePath = path.join(directoryPath, file);
            const thumbnailPath = path.join(
                publicFolderPath,
                "thumbnails",
                `${path.parse(file).name}_thumb.jpg`
            );

            if (!fs.existsSync(thumbnailPath)) {
                ffmpeg(filePath).screenshots({
                    count: 1,
                    folder: path.join(publicFolderPath, "thumbnails"),
                    filename: `${path.parse(file).name}_thumb.jpg`,
                });
            }

            return {
                filename: file,
                thumbnail: `${path.parse(file).name}_thumb.jpg`.replaceAll("\\","/")
            };
        });

        res.status(200).json(thumbnails);
    });
});

app.get("/videos/:file", (req, res) => {
    const range = req.headers.range;
    const file = req.params.file;
    if (!range) {
        res.status(400).send("Range header kötelező");
        return;
    }
    let fileNameSplit;
    if (!file) {
        res.status(400).json({ message: "Érvénytelen fájlnév." });
        return;
    } else {
        fileNameSplit = file.split(".");
        if (
            fileNameSplit.length < 2 ||
            !acceptedExtensions.includes(fileNameSplit[fileNameSplit.length - 1])
        ) {
            res.status(400).json({ message: "Érvénytelen kiterjesztés." });
            return;
        }
    }
    const videoPath = directoryPath + "/" + file;
    console.log(videoPath)
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": `video/${fileNameSplit[fileNameSplit.length - 1]}`,
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(port,'0.0.0.0', () => {
    console.log(`Listening on port ${port}!`);
});
