import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function ingest(events) {

  // Fetch the webpage content
    // Step 2: Save to Prisma database
    try {
      for (const event of events) {
        await prisma.event.create({
          data: {
            title: event.title,
            link: event.link,
            date: event.date,
            startTime: event.startTime,
            age: parseInt(event.age.replace('+', ''), 10) || null,  // Clean and parse age
            venue: event.venue,
            price: event.price,
            bands: event.bands,  // Save the array of bands
          },
        });
      }
      console.log('Data saved successfully!');
    } catch (err) {
      console.error('Error saving data to the database:', err);
    }
}
