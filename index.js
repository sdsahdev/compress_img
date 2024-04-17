const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Function to resize watermark image to match dimensions of input image
async function resizeWatermark(inputImagePath, watermarkPath) {
  const { width, height } = await sharp(inputImagePath).metadata();
  return sharp(watermarkPath).resize(100).toBuffer();
}

// Function to compress and add an image
async function processImage(inputPath, watermarkBuffer, outputPath) {
  await sharp(inputPath)
    .jpeg({ quality: 40 })
    .composite([{ input: watermarkBuffer, gravity: "southeast" }]) // Add watermark at bottom right corner
    .toFile(outputPath); // Save the processed image
}

// Function to process all images in a folder
async function processImagesInFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|gif)$/i.test(file)
  );

  const smallImgFolder = path.join("smallImg");
  if (!fs.existsSync(smallImgFolder)) {
    fs.mkdirSync(smallImgFolder);
  }

  const watermarkBuffer = await resizeWatermark(
    path.join(folderPath, imageFiles[0]), // Choose the first image for watermark size
    path.join("watermark.png")
  );

  for (let i = 0; i < imageFiles.length; i++) {
    const inputPath = path.join(folderPath, imageFiles[i]);
    const outputPath = path.join(
      smallImgFolder,
      `compressed_${i}${path.extname(inputPath)}`
    );

    await processImage(inputPath, watermarkBuffer, outputPath);
    console.log(`Image ${i + 1}/${imageFiles.length} processed.`);
  }
}

// Folder path containing images to process
const folderPath = "images";

// Start processing the images in the folder
processImagesInFolder(folderPath)
  .then(() => console.log("All images processed successfully."))
  .catch((err) => console.error("Error processing images:", err));
