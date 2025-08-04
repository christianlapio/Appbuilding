import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateScript = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to generate script");
      const data = await res.json();
      setScript(data.script);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-8 p-8 font-sans bg-gray-50">
      <h1 className="text-3xl font-bold text-center">AI Short-Form Video Script Generator</h1>
      <div className="w-full max-w-xl flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Enter a topic or prompt</span>
          <input
            type="text"
            placeholder="e.g. How to stay focused"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <button
          onClick={generateScript}
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Script"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {script && (
          <div className="flex flex-col gap-2">
            <span className="font-medium">Generated Script (editable):</span>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={8}
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
