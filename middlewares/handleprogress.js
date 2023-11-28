function uploadProgressMiddleware(req, res, next) {
  let uploadedSize = 0;

  req.on("data", (chunk) => {
    uploadedSize += chunk.length;
    const percent = (uploadedSize / req.headers["content-length"]) * 100;
    res.write(`Upload Progress: ${percent.toFixed(2)}%\n`);
  });

  req.on("end", () => {
    res.end("Upload Complete\n");
  });

  next();
}

module.exports = uploadProgressMiddleware;
