import axios from 'axios';
import * as cheerio from 'cheerio';

function parseDescription(description) {
    // Split description by the '/' delimiter
    const descElements = description.split('/').map(element => element.trim());
  
    // Initialize variables for price and start time
    let price = '';
    let startTime = '';
  
    // Loop through each element in the description
    descElements.forEach(element => {
      // If the element contains a '$', it's related to the price
      if (element.includes('$')) {
        price = element; // Capture the entire price string
      }
  
      // If the element contains time (e.g., 'Start 8:30pm' or 'Doors 7pm'), capture it
      const timeMatch = element.match(/(\d{1,2}(:\d{2})?(am|pm)?)/i); // Match time in format like 7pm, 8:30pm, 7:00pm
      if (timeMatch) {
        // If 'Start' or 'Doors' is found with time, we assign it as start time
        if (element.toLowerCase().includes('start') || element.toLowerCase().includes('doors')) {
          startTime = timeMatch[0]; // Use the matched time (e.g., 8:30pm)
        }
      }
    });
  
    // Return parsed data
    return { price, startTime };
  }

// Function to scrape concerts
export async function lilypad() {
  const url = 'https://www.lilypadinman.com';  // Replace with your actual URL

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    console.log('Page loaded');

    const events = [];
    let bands = [];
    const age = 18;
    const venue = "The Lilypad";

    $('div.eventlist-column-info').each((index, element) => {
      let title = $(element).find('h1.eventlist-title a').text().trim();
      let link = $(element).find('h1.eventlist-title a').attr('href');
      let date = $(element).find('time.event-date').attr('datetime');
      let time = $(element).find('time.event-time-12hr-start').text().trim();
      let price = $(element).find('div.eventlist-excerpt p').text().trim();
      let categories = $(element).find('div.eventlist-cats').text().toLowerCase();
      let description = $(element).find('div.eventlist-excerpt').text().toLowerCase();

      // Check if any excluded words appear
      if (
        categories.includes('jazz') || 
        categories.includes('bebop') || 
        description.includes('open mic') || 
        description.includes('jazz') || 
        description.includes('bebop') ||
        description.includes('winter break') ||
        title.includes('Yoga') ||
        title.includes('Variety Show')
      ) {
        console.log(`Omitting event: ${title}`);  
        return;  
      }
      const { parsedPrice, startTime } = parseDescription(description);
      bands = title.split('/').map(band => band.trim());
      link = url + link;  

      events.push({
        title,
        link,
        date,
        startTime,
        age,
        venue,
        parsedPrice,
        bands,
      });
    });

    console.log('Scraped Events:', events);
    return events;
  } catch (error) {
    console.error('Error fetching the page:', error);
  }
}