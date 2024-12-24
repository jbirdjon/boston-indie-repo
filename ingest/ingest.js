import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function ingest(events) {
  try {
    const upsertPromises = events.map(async (event) => {
      // Sanitize fields before upsert
      const sanitizedEvent = {
        title: event.title,
        link: event.link,
        date: event.date,
        startTime: event.startTime || null,  // Default to null if not available
        age: event.age,
        venue: event.venue,
        price: event.price ?? null,  // Default to null if price is undefined
        bands: event.bands,  // Ensure 'bands' is an array
      };

      // Perform upsert operation
      await prisma.event.upsert({
        where: { link: sanitizedEvent.link },
        update: sanitizedEvent,  // Update with the sanitized event details
        create: sanitizedEvent,  // Create with the sanitized event details
      });
    });

    // Wait for all upsert operations to complete
    await Promise.all(upsertPromises);

    console.log('Data processed successfully!');
  } catch (err) {
    console.error('Error processing data:', err);
  }
}
