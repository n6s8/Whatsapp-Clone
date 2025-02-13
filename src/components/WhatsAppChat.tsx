import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WhatsApp.module.css";
import glass from "../assets/icon.png";
import vector from "../assets/vector.png";
import FlightIcon from "../assets/images.svg";

export default function WhatsAppChat() {
  const navigate = useNavigate();

  const idInstance = localStorage.getItem("idInstance");
  const apiTokenInstance = localStorage.getItem("apiTokenInstance");
  const userPhone = localStorage.getItem("phoneNumber");

  useEffect(() => {
    if (!idInstance || !apiTokenInstance || !userPhone) {
      navigate("/");
    }
  }, [idInstance, apiTokenInstance, userPhone, navigate]);

  const [name, setName] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{
    [chatId: string]: { chatId: string; text: string }[];
  }>({});
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [list, setList] = useState<string[]>([]);

  const API_URL = `https://7103.api.greenapi.com`;

  const Select = (chat: string) => {
    setSelectedChat(chat);
    setChatId(`${chat}@c.us`);
  };

  const Add = () => {
    if (!name) return;
    if (list.includes(name)) {
      alert("Chat already exists!");
      setName("");
      return;
    }
    setList([name, ...list]);
    setName("");
  };

  const sendMessage = async () => {
    if (!chatId || !message) {
      alert("Select a chat and enter a message!");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, message }),
        },
      );

      const data = await response.json();
      if (data.idMessage) {
        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), { chatId, text: message }],
        }));
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getMessages = async () => {
    try {
      const response = await fetch(
        `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
      );
      const data = await response.json();

      if (data?.body) {
        const receivedMessage = data.body;
        if (receivedMessage.messageData?.typeMessage === "textMessage") {
          const chatId = receivedMessage.senderData.chatId;

          setMessages((prev) => ({
            ...prev,
            [chatId]: [
              ...(prev[chatId] || []),
              {
                chatId,
                text: receivedMessage.messageData.textMessageData.textMessage,
              },
            ],
          }));
        }
      }
    } catch (error) {
      console.error("Error receiving messages:", error);
    }
  };

  useEffect(() => {
    getMessages();
    const interval = setInterval(getMessages, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.nav}>
        <h1>Chat</h1>

        <div className={styles.in_row}>
          <div className={styles.chatContainer}>
            <img src={glass} alt="magnifying glass" className={styles.glass} />
            <input
              type="text"
              placeholder="Start a new chat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.search}
            />
            <img src={vector} alt="vector" className={styles.vector} />
          </div>
          <button className={styles.submit} onClick={Add}>
            Create a new chat
          </button>
        </div>

        <div className={styles.users}>
          {list.map((item) => (
            <div
              key={item}
              className={`${styles.element} ${selectedChat === item ? styles.selected : ""}`}
              onClick={() => Select(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chat}>
        <div className={styles.info}>
          <h1>Chat: {selectedChat || "Select a chat"}</h1>
        </div>

        <div className={styles.messages}>
          <h3>Messages</h3>
          {!selectedChat || !messages[selectedChat + "@c.us"] ? (
            <p>No messages yet.</p>
          ) : (
            <ul className={styles.list}>
              {messages[selectedChat + "@c.us"].map((msg, index) => (
                <li key={index} className={styles.listItem}>
                  <span className={styles.text}>
                    <strong>{msg.chatId.slice(0, -5)}:</strong> {msg.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.write}>
          <input
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={styles.input_write}
            disabled={!selectedChat}
          />

          <button
            onClick={sendMessage}
            className={styles.send}
            disabled={!selectedChat}
          >
            <img src={FlightIcon} alt="send" className={styles.flight} />
          </button>
        </div>
      </div>
    </div>
  );
}
