import Header from "../components/Header";
import { useState, useEffect } from "react";
import api from "../api";
import PendingOrderCard from "../components/PendingOrderCard";

function PendingOrderPage() {
  const username = localStorage.getItem("username");
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/user/pending-orders", {
        withCredentials: true,
      });
      setOrders(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching pending orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Header user={username} />
      <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
        <h2>Your Pending Orders</h2>
        {orders.length === 0 ? (
          <p>You have no Pending Orders.</p>
        ) : (
          orders.map((item: any) => (
            <PendingOrderCard key={item.id} {...item} refresh={fetchOrders} />
          ))
        )}
      </div>
    </>
  );
}

export default PendingOrderPage;
