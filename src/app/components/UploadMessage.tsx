"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Arweave from "arweave";

export default function UploadMessage() {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const router = useRouter(); // Initialize router to navigate programmatically

  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  const connectWallet = async () => {
    try {
      await (window as any).arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "SIGN_TRANSACTION",
        "DISPATCH",
        "ACCESS_PUBLIC_KEY",
      ]);

      const addr = await (window as any).arweaveWallet.getActiveAddress();
      setAddress(addr);

      console.log("ArConnect wallet connected:", addr);
      setConnected(true);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet.");
    }
  };

  const uploadMessage = async () => {
    try {
      setUploading(true);

      const transaction = await arweave.createTransaction({ data: message });
      transaction.addTag("Content-Type", "text/plain");
      transaction.addTag("App-Name", "Humanity Archive");
      transaction.addTag("App-Version", "1.0.0");

      await (window as any).arweaveWallet.sign(transaction);
      const response = await (window as any).arweaveWallet.dispatch(transaction);

      if (response && response.id) {
        setTxId(response.id);
        // Save the message to localStorage and redirect
        const messages = JSON.parse(localStorage.getItem("messages") || "[]");
        messages.push(message);
        localStorage.setItem("messages", JSON.stringify(messages));
        
        // Redirect to the messages page after uploading
        router.push("/messages");
      } else {
        alert("Upload failed. Try again!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading message.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!connected && (
        <button
          onClick={connectWallet}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg mb-6"
        >
          Connect ArConnect Wallet 🔗
        </button>
      )}

      {connected && (
        <div className="text-sm text-gray-300 mb-4">
          Connected as: {address}
        </div>
      )}

      <textarea
        className="w-full max-w-md p-4 rounded-lg bg-white/10 border border-white/20 mb-4"
        rows={6}
        placeholder="Write your message to the future..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={uploadMessage}
        disabled={uploading || !message || !connected}
        className="bg-white text-black px-6 py-2 rounded-lg transition disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload to Arweave 🚀"}
      </button>

      {txId && (
        <div className="mt-6 text-center">
          <p className="text-green-400">Successfully uploaded!</p>
          <a
            href={`https://arweave.net/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-300 mt-2 block"
          >
            View your Message ↗
          </a>
        </div>
      )}
    </div>
  );
}
