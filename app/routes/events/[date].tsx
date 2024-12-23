// app/routes/events/[date].tsx

import { json, LoaderFunction, useLoaderData } from "@remix-run/node";
import { prisma } from "~/db.server"; // Import Prisma client

export let loader: LoaderFunction = async ({ params }) => {
  const { date } = params; // The date will come from the URL parameter

  // Fetch events for the given date
  const events = await prisma.event.findMany({
    where: {
      date: new Date(date), // Use the date parameter to find events for that date
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return json(events); // Return the events as JSON
};

export default function EventsByDate() {
  const events = useLoaderData(); // Get events from loader

  return (
    <div>
      <h1>Events for {events[0]?.date ? events[0].date.toLocaleDateString() : "N/A"}</h1>
      {events.length === 0 ? (
        <p>No events found for this date.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Band</th>
              <th>Venue</th>
              <th>Time</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.bands.join(" / ")}</td>
                <td>{event.venue}</td>
                <td>{event.startTime}</td>
                <td>${event.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
