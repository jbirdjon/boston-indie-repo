import { obriens } from './obriens.js';
import { ingest } from './ingest.js';

// Use an async function to handle await
async function scraper() {
    console.log('Scraping and saving data...');
  
        // Fetch events using the obriens scraper
    const Obriensevents = await obriens();
  
        // Ingest the events (assuming the ingest function is defined in ingest.js)
    await ingest(Obriensevents);

    const lilypadEvents = await lilypad();
    await ingest(lilypadEvents);
  
  console.log('Scraping and saving complete.');
}

// Call the main function
scraper();