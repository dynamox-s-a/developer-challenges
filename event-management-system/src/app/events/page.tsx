"use client";

import { useState, useEffect } from "react";
import CardList from "@/components/card/CardList";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/db.json");
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error("Erro ao buscar os eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading events...</p>;
  }

  return (
    <div>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <CardList events={events} />
      )}
    </div>
  );
};

export default Events;
