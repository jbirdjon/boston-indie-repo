import Tesseract from 'tesseract.js';
import Jimp from 'jimp'; // For image processing

export async function skatepark() {
  const imagePath = '/mnt/data/stateparkdecember.jpg'; // Local path to your uploaded image

  try {
    // Load the image for processing
    const image = await Jimp.read(imagePath);

    // Define yellow color range (adjust for the exact shade)
    const yellowColor = { r: 255, g: 255, b: 0 }; // Approximation
    const tolerance = 40; // Tolerance for color matching

    // Perform OCR on the image
    console.log('Starting OCR...');
    const ocrResult = await Tesseract.recognize(imagePath, 'eng');
    console.log('OCR complete.');

    const extractedText = ocrResult.data.text;
    console.log('Extracted text:', extractedText);

    // Analyze the image to find yellow indicators
    const rowsWithYellow = [];
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // Scan specific regions of the image for the yellow marker
    for (let y = 0; y < height; y += 50) {
      for (let x = 0; x < width; x++) {
        const color = Jimp.intToRGBA(image.getPixelColor(x, y));
        if (
          Math.abs(color.r - yellowColor.r) < tolerance &&
          Math.abs(color.g - yellowColor.g) < tolerance &&
          Math.abs(color.b - yellowColor.b) < tolerance
        ) {
          rowsWithYellow.push(y);
          break;
        }
      }
    }

    console.log('Rows with yellow markers:', rowsWithYellow);

    // Match extracted text rows to yellow-highlighted rows
    const events = [];
    const lines = extractedText.split('\n');
    let currentRow = 0;

    for (const line of lines) {
      const match = line.match(/(\d+\.\d+)\s+(\w+)\s+(.*)\s+at\s+(\d+.*)/);
      if (match) {
        const date = match[1].trim(); // e.g., "12.1"
        const day = match[2].trim(); // e.g., "SUN"
        const title = match[3].trim(); // Event title
        const startTime = match[4].trim(); // Start time

        // Check if this row corresponds to a yellow-highlighted row
        if (rowsWithYellow.includes(currentRow)) {
          events.push({
            title,
            date: `2024-${date.replace('.', '-')}`, // Convert to ISO format
            startTime,
            venue: 'State Park',
            age: 21, // Assuming default
            price: null,
            bands: [title], // Assuming title contains the band name
          });
        }

        currentRow++;
      }
    }

    console.log('Filtered events:', events);
    return events;
  } catch (error) {
    console.error('Error processing skatepark events:', error);
    return [];
  }
}
