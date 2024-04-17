const fs = require("fs");
const path = require("path");
const { folderPath, resizeWatermark, processImage } = require(".");

// Function to process all images in a folder

async function processImagesInFolder() {
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|gif)$/i.test(file)
  );

  for (let i = 0; i < imageFiles.length; i++) {
    const inputPath = path.join(folderPath, imageFiles[i]);
    const outputPath = path.join(
      folderPath,
      `compressed_${i}${path.extname(inputPath)}`
    );
    const watermarkResizedPath = path.join(
      folderPath,
      `watermark_resized_${i}.png`
    );

    await resizeWatermark(
      inputPath,
      path.join(folderPath, "watermark.png"),
      watermarkResizedPath
    );

    await processImage(inputPath, watermarkResizedPath, outputPath);
    console.log(`Image ${i + 1}/${imageFiles.length} processed.`);
  }
}
exports.processImagesInFolder = processImagesInFolder;
