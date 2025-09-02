import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";

const Chatbot = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send to backend
      const response = await axios.post("/chat", {
        message: input,
        lang: language,
      });

      // Add bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: response.data.response, sender: "bot" },
        ]);
        setLoading(false);
      }, 500); // Small delay for better UX
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { text: t("chatError"), sender: "bot" },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in">
      <h2 className="chatbot-title">{t("chatbotTitle")}</h2>
      
      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="empty-chat-message">{t("chatbotWelcome")}</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-icon">
                {msg.sender === "user" ? <FaUser /> : <FaRobot />}
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))
        )}
        {loading && (
          <div className="message bot-message">
            <div className="message-icon">
              <FaRobot />
            </div>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chatPlaceholder")}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} className="send-btn">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;