import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaste, type PasteData } from "../api";

export default function ViewPaste() {
  const { id } = useParams<{ id: string }>();
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    getPaste(id)
      .then(setPaste)
      .catch(() => setError("Paste not found or expired"));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!paste) return <p>Loading...</p>;

  return (
    <div>
      <h1>Paste</h1>
      <pre>{paste.content}</pre>
      <p>Remaining views: {paste.remaining_views ?? "Unlimited"}</p>
    </div>
  );
}
