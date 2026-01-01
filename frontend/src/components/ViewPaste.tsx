import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clipboard, ClipboardCheck, Clock, Eye, AlertCircle, ArrowLeft } from "lucide-react";
import { getPaste, type PasteData } from "../api";

export default function ViewPaste() {
  const { id } = useParams<{ id: string }>();
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPaste(id)
      .then(setPaste)
      .catch(() => setError("This paste has expired or does not exist."));
  }, [id]);

  const handleCopy = () => {
    if (paste) {
      navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Create a new paste
        </Link>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500 font-medium">Loading paste...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">View Paste</h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye size={14} /> {paste.remaining_views ?? "∞"} views left
            </span>
            {paste.expires_at && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> Expires soon
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-300"
        >
          {copied ? <ClipboardCheck size={18} className="text-green-600" /> : <Clipboard size={18} />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      <div className="relative group">
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Optional: Language label could go here */}
        </div>
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed shadow-lg">
          <code>{paste.content}</code>
        </pre>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          + Create your own secret paste
        </Link>
      </div>
    </div>
  );
}