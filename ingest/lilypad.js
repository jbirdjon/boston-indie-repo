import axios from 'axios';
import cheerio from 'cheerio';

// Function to scrape concerts
export async function Lilypad() {
  const url = 'https://your-target-website.com';  // Replace with your actual URL

  try {
    // Step 1: Fetch the HTML content
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);  // Load the HTML content into cheerio

    console.log('Page loaded');

    // Step 2: Initialize an array to store events
    const events = [];

    // Step 3: Loop through each event item
    $('div.eventlist-column-info').each((index, element) => {
      const title = $(element).find('h1.eventlist-title a').text().trim();
      const link = $(element).find('h1.eventlist-title a').attr('href');
      const date = $(element).find('time.event-date').attr('datetime');
      const time = $(element).find('time.event-time-12hr-start').text().trim();
      const venue = $(element).find('li.eventlist-meta-address').first().text().trim();
      const price = $(element).find('div.eventlist-excerpt p').text().trim();
      const categories = $(element).find('div.eventlist-cats').text().toLowerCase();
      const description = $(element).find('div.eventlist-excerpt').text().toLowerCase();

      // Step 4: Check if any excluded words appear
      if (
        categories.includes('jazz') || 
        categories.includes('bebop') || 
        description.includes('open mic') || 
        description.includes('jazz') || 
        description.includes('bebop')
      ) {
        console.log(`Omitting event: ${title}`);  // Logging for debugging
        return;  // Skip this event
      }

      // Clean and format the data
      const eventDetails = {
        title,            // Event title (e.g., band names)
        link,             // Event link
        date,             // Date in the format "2025-01-03"
        time,             // Time in 12-hour format
        venue,            // Venue name (e.g., The Lilypad)
        price,            // Price range
      };

      // Step 5: Push each event to the events array
      events.push(eventDetails);
    });

    // Step 6: Return the extracted events
    console.log('Scraped Events:', events);
    return events;
  } catch (error) {
    console.error('Error fetching the page:', error);
  }
}

// Example usage
scrapeConcerts().then(events => {
  // Process or display the events as needed
  console.log(events);
});
