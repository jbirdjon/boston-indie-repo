import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function ingest(events) {
  try {
    for (const event of events) {
      // Upsert each event based on a unique field (e.g., link)
      await prisma.event.upsert({
        where: { link: event.link }, // Use a unique field to check for existence
        update: {
          // If the event already exists, update its details
          title: event.bands.join(' / '), // Combine the band names back into a single string
          date: event.date,
          startTime: event.startTime,
          age: event.age,
          venue: event.venue,
          price: event.price,
          bands: event.bands, // Update the bands array
        },
        create: {
          // If the event doesn't exist, insert it
          title: event.bands.join(' / '),
          link: event.link,
          date: event.date,
          startTime: event.startTime,
          age: event.age,
          venue: event.venue,
          price: event.price,
          bands: event.bands, // Save the array of bands
        },
      });
    }
    console.log('Data processed successfully!');
  } catch (err) {
    console.error('Error processing data:', err);
  }
}
