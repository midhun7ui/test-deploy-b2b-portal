import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { supportApi } from "./services/supportApi";
import { initialSupportTickets } from "./data/supportMockData";
import { getCurrentUser } from "../auth/authState";

const SupportContext = createContext(null);

export function SupportProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const pollingRef = useRef(null);

  const fetchTickets = useCallback(async (params = {}, silent = false) => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      if (!silent) {
        setLoading(true);
      }
      setIsSyncing(true);
      setError(null);
      const data = await supportApi.getTickets(params);
      if (Array.isArray(data)) {
        setTickets(data);
        setLastSynced(new Date());
      }
    } catch (err) {
      console.warn("Failed to load support tickets from backend, using fallback:", err);
      // If we don't have any tickets yet, fall back to initial mock tickets for demo/offline resilience
      setTickets((current) => {
        if (current.length === 0) {
          return initialSupportTickets.map((t) => ({ ...t }));
        }
        return current;
      });
      if (!silent) {
        setError(err?.response?.data?.detail || "Could not synchronize tickets with operations server.");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
      setIsSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Live real-time polling every 10 seconds to keep tickets in sync with admin desk
  useEffect(() => {
    pollingRef.current = setInterval(() => {
      const user = getCurrentUser();
      if (user && !document.hidden) {
        fetchTickets({}, true);
      }
    }, 10000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchTickets]);

  async function createTicket(ticketData) {
    try {
      const newTicket = await supportApi.createTicket(ticketData);
      setTickets((current) => [newTicket, ...current]);
      setLastSynced(new Date());
      return newTicket;
    } catch (err) {
      console.error("Error creating ticket via backend:", err);
      throw err;
    }
  }

  async function sendReplyMessage(ticketId, message) {
    try {
      const newMsg = await supportApi.sendTicketMessage(ticketId, message);
      setTickets((current) =>
        current.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              status: t.status === "Resolved" || t.status === "Closed" ? "In Progress" : t.status,
              messages: [...(t.messages || []), newMsg],
              updatedAt: "Just now",
            };
          }
          return t;
        })
      );
      setLastSynced(new Date());
      return newMsg;
    } catch (err) {
      console.warn("Failed to send reply message to backend:", err);
      throw err;
    }
  }

  return (
    <SupportContext.Provider
      value={{
        tickets,
        loading,
        error,
        lastSynced,
        isSyncing,
        createTicket,
        sendReplyMessage,
        refreshTickets: () => fetchTickets({}, false),
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error("useSupport must be used within SupportProvider");
  }
  return context;
}
