import { useLoaderData } from '@remix-run/react';
import { Event } from '../../types/event';
import { prisma } from '~/db.server';  // Import your database client


// The loader function fetches data from your database (e.g., Prisma)
export const loader = async () => {
  const events = await prisma.event.findMany();  // Fetch events from Prisma
  return { events };  // Return the events in an object
};

export default function Index() {
  const { events } = useLoaderData<{ events: Event[] }>();

  return (
    <div>
      <h1>Upcoming Events</h1>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Venue</th>
            <th>Time</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.bands.join(' / ')}</td>
              <td>{event.venue}</td>
              <td>{event.startTime}</td>
              <td>${event.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
