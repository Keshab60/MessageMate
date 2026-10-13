import React, { useState, useRef } from 'react';
import { FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi';

const Todo = () => {
  const [change, setChange] = useState({ text: "", date: "" });
  const [items, setItems] = useState([]);
  const text = useRef(null);
  const date = useRef(null);

  const changetheinput = (e) => {
    setChange({ ...change, [e.target.name]: e.target.value });
  };

  const add = () => {
    const message = text.current?.value;
    const itemDate = date.current?.value;
    if (!message) return;

    setItems([...items, { message, Date: itemDate }]);
    setChange({ text: "", date: "" });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <div className="glass-panel" style={{ padding: "32px", borderRadius: "20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px", color: "#f8fafc" }}>
          Task Manager
        </h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            ref={text}
            name="text"
            value={change.text}
            onChange={changetheinput}
            placeholder="Add a new task..."
            style={{
              flex: "2",
              minWidth: "200px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <input
            type="date"
            ref={date}
            name="date"
            value={change.date}
            onChange={changetheinput}
            style={{
              flex: "1",
              minWidth: "140px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(15, 23, 42, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={add}
            className="btn-gradient"
            style={{ padding: "10px 18px", borderRadius: "10px" }}
          >
            <FiPlus /> Add
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div>
                <p style={{ color: "#f8fafc", fontWeight: 600, fontSize: "14px" }}>{item.message}</p>
                {item.Date && (
                  <p style={{ color: "#94a3b8", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <FiCalendar /> {item.Date}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeItem(index)}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#f87171",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ textAlign: "center", color: "#64748b", padding: "20px 0" }}>No tasks added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
