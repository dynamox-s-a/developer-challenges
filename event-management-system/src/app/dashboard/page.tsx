"use client";

import { useState, useEffect } from "react";
import CardAdminEventList from "@/components/card/CardAdminList";
import Header from "../../components/header/Header";
import { getEvents } from "../services/events";
import styles from "../dashboard/dashboard.module.css";
import { logout } from "../services/users";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { ROLES } from "../constants/roles";

const Events = () => {
  useAuthGuard(ROLES.ADMIN);
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

  useEffect(() => {
    document.title = "Dashboard";
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
        <CardAdminEventList events={events} searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default Events;
