const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const fs = require("fs");
const express = require("express");

// the ytdl download template
const downloadTemplate = async (videoUrl) => {
  // generate output file path
  const info = await ytdl.getBasicInfo(videoUrl);
  const title = info.videoDetails.title.replace("/", ",");
  const outputFilePath = `${
    process.env.HOME || process.env.USERPROFILE
  }/Downloads/${title}.mp3`;

  const options = {
    highWaterMark: 5 * 1024 * 1024,
    quality: "highestaudio",
    filter: "audioonly",
  };

  const videoStream = ytdl(videoUrl, options);
  const fileStream = fs.createWriteStream(outputFilePath);
  videoStream.pipe(fileStream);

  videoStream.on("end", () => {
    console.log("Download complete!");
  });

  videoStream.on("error", (error) => {
    console.error("Error:", error);
  });
};

// download music based on link type (playlist or video)
const downloadMusic = async (videoUrl) => {
  if (videoUrl.includes("playlist?list")) {
    console.log("This is a playlist");
    await ytpl.getPlaylistID(videoUrl).then((playlistID) => {
      ytpl(playlistID).then((playlist) => {
        for (i = 0; i < playlist.items.length; i++) {
          downloadTemplate(playlist.items[i].shortUrl);
        }
      });
    });
  } else {
    console.log("This is a single video");
    downloadTemplate(videoUrl);
  }
};

// start server
app = express();

app.use(express.static("./public"));

// get videoUrl from client, call the download function
app.get("/musicInfo/query", (req, res) => {
  const { url } = req.query;

  downloadMusic(url);

  res.status(200).send("Received the request...");
});

// set all route except for written as 404
app.all("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(5000, () => {
  console.log("server is listening on port 5000....");
});
