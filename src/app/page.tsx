// app/page.tsx
import UploadMessage from "@/app/components/UploadMessage";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">🌌 Messages to the Future</h1>
      <UploadMessage />
    </div>
  );
}
