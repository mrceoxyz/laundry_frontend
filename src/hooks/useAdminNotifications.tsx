// hooks/useAdminNotifications.ts
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export const useAdminNotifications = () => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsUrl) {
      console.error("NEXT_PUBLIC_WS_URL is not defined");
      return;
    }

    const socket = new WebSocket(`${wsUrl}/ws/admin/notifications/`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Admin notification WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "NEW_ORDER") {
          toast.custom(() => (
            <div className="bg-white shadow-lg rounded-xl p-4 border-l-4 border-green-600">
              <div className="font-semibold text-gray-900">
                New Order Received
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Order #{data.order_id} from {data.customer}
              </div>
            </div>
          ));
        }
      } catch (err) {
        console.error("Invalid WebSocket payload", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    socket.onclose = () => {
      console.warn("Admin notification WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);
};
