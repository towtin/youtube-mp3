function downloadMusic() {
  const videoUrl = document.getElementById("userInput").value;
  fetch(`/musicInfo/query?url=${videoUrl}`).catch((err) => {
    console.error("Error:", err);
  });

  alert("CHECK YOUR DOWNLOAD FOLDER!!!");
}
