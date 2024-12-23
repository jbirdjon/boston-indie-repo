// This script scrapes the O'Brien's website for upcoming events and saves them to the database.

async function main() {
    const events = await obriens();
    
    console.log('Scraping and saving complete.');
  }
  