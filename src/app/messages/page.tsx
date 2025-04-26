"use client"; // Add this line to indicate this is a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const Messages = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const router = useRouter(); // Initialize useRouter hook for navigation

  useEffect(() => {
    // Load the messages (You would actually fetch this from Arweave)
    const fetchMessages = () => {
      const storedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
      setMessages(storedMessages);
    };
    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    router.push("/"); // Navigate to the Send Message page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-center animate__animated animate__fadeIn">
        🌌 Messages to the Future
      </h1>

      {/* Send Message Button */}
      <button
        onClick={handleSendMessage}
        className="bg-white hover:bg-white
        text-black px-6 py-2 rounded-lg mb-6 transition-all"
      >
        Send a Message ✨
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="relative group bg-white/10 p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition-all"
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-indigo-500 to-transparent opacity-40 rounded-lg"></div>
            <p className="z-10 text-xl">{message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
