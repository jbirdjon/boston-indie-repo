// Use ES module imports
import axios from 'axios';
import * as cheerio from 'cheerio';

const obriensage = 21;

export async function obriens() {

  const url= "https://obrienspubboston.com/shows/?filter_genre=shoegaze,rock,noise-rock,indie-rock,indie-folk,garage,alternative,electronic,emo&unfilter=1"

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    console.log('got the page');

    // Store events in an array
    const events = [];

    // Loop through each event entry (each <div> with class "uncode-post-table-column")
    $('div.t-entry').each((index, element) => {
      const title = $(element).find('h4.t-entry-title a').text();  // Get event title
      const link = $(element).find('h4.t-entry-title a').attr('href');  // Get event link
      const dateTimeText = $(element).find('div.t-entry-excerpt p').text(); // Get the text for date, time, and age restriction
      console.log('got the data');

      // Parse date, time, and age from the dateTimeText
      const dateTimeParts = dateTimeText.split(' ');
      const date = new Date(dateTimeParts[1] + ' ' + dateTimeParts[2]); // Assuming date is in format "Thursday, December 26"
      const startTime = dateTimeParts[3];  // "8PM" (you may need to adjust this parsing if time is in a different format)
      const age = obriensage; //default age for 

      // Venue and price are fixed, as per your requirements
      const venue = 'O\'Brien\'s Pub';
      const price = 15;

      // Split the title into bands (based on "/")
      const bands = title.split('/').map(band => band.trim());

      // Add the event to the events array
      events.push({
        bands,      // Array of band names
        link,
        date,
        startTime,
        age,
        venue,
        price,
      });
    });
    console.log('got the events');
    return events;
} catch (error) {
  console.error('Error fetching the page:', error);
  return [];
}
}