import { obriens } from './obriens.js';
import { ingest }  from './ingest.js';

console.log('Scraping and saving data...');
const events = await obriens();
await ingest(events);

console.log('Scraping and saving complete.');
