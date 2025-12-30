import { useState } from "react";
import { createPaste } from "../api";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number>();
  const [maxViews, setMaxViews] = useState<number>();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
   try {
    
       setError(null);
       const result = await createPaste(content, ttl, maxViews)
       setUrl(result?.url);
   } catch (error:any) {
    
       setError(error?.message as string || "Error creating paste");
   }

    
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Create Paste</h1>
      <textarea
        placeholder="Enter text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", height: 150 }}
      />
      <div style={{ marginTop: 1 }}>
        <input
          type="number"
          placeholder="TTL seconds (optional)"
          value={ttl ?? ""}
          onChange={(e) => setTtl(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews ?? ""}
          onChange={(e) => setMaxViews(Number(e.target.value))}
        />
      </div>
      <button onClick={handleSubmit} style={{ marginTop: 10 }}>
        Create
      </button>
      {url && (
        <p>
          Shareable URL: <a href={url}>{url}</a>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
