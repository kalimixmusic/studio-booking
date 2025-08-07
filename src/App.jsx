
import React, { useState, useEffect } from "react";

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const getStored = () => JSON.parse(localStorage.getItem("kalimixBookings") || "[]");
const setStored = (data) => localStorage.setItem("kalimixBookings", JSON.stringify(data));

export default function App() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [admin, setAdmin] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getStored());
  }, []);

  useEffect(() => {
    setStored(bookings);
  }, [bookings]);

  const bookSlot = () => {
    if (!date || !time || !name || !email) {
      alert("All fields required");
      return;
    }
    const exists = bookings.find(b => b.date === date && b.time === time);
    if (exists) {
      alert("This time slot is already booked.");
      return;
    }
    const newBooking = { date, time, name, email };
    setBookings([...bookings, newBooking]);
    setDate(""); setTime(""); setName(""); setEmail("");
    alert("Booking confirmed!");
  };

  const deleteBooking = (index) => {
    const updated = [...bookings];
    updated.splice(index, 1);
    setBookings(updated);
  };

  const loginAdmin = () => {
    if (adminKey === "kalimix123") setAdmin(true);
    else alert("Wrong admin password.");
    setAdminKey("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <img src="/logo.png" alt="Kalimix Logo" style={{ maxWidth: 250, display: "block", margin: "0 auto 20px" }} />
      <h2>🎙️ Book Your Studio Slot</h2>

      <label>Date:</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <label>Time Slot:</label>
      <select value={time} onChange={e => setTime(e.target.value)}>
        <option value="">Select a time</option>
        {timeSlots.map(slot => (
          <option key={slot} value={slot} disabled={bookings.some(b => b.date === date && b.time === slot)}>
            {slot} {bookings.some(b => b.date === date && b.time === slot) ? "(Booked)" : ""}
          </option>
        ))}
      </select>

      <label>Your Name:</label>
      <input value={name} onChange={e => setName(e.target.value)} />

      <label>Your Email:</label>
      <input value={email} onChange={e => setEmail(e.target.value)} />

      <button onClick={bookSlot}>Book Now</button>

      <hr style={{ margin: "30px 0" }} />

      {!admin ? (
        <>
          <label>Admin Access:</label>
          <input type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)} />
          <button onClick={loginAdmin}>Login as Admin</button>
        </>
      ) : (
        <>
          <h3>📋 All Bookings</h3>
          {bookings.length === 0 && <p>No bookings yet.</p>}
          {bookings.map((b, i) => (
            <div key={i} className="card">
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
              <p><strong>Name:</strong> {b.name}</p>
              <p><strong>Email:</strong> {b.email}</p>
              <button className="danger" onClick={() => deleteBooking(i)}>Delete</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
