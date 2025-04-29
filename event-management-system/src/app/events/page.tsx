"use client";

import { useState, useEffect } from "react";
import CardList from "@/components/card/CardReaderList";
import Header from "../../components/header/Header";
import { getEvents } from "../services/events";
import { logout } from "../services/users";
import { useRouter } from "next/navigation";
import styles from "./event.module.css";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { ROLES } from "../constants/roles";

const Events = () => {
  useAuthGuard(ROLES.READER);
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Erro ao buscar os eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p style={{ color: "white" }}>Loading events...</p>;
  }

  return (
    <div className={styles.eventsContainer}>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onLogout={handleLogout}
      />
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <CardList events={events} searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default Events;
