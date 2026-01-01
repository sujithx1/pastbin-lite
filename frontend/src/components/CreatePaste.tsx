import { useState } from "react";
import { createPaste } from "../api";
import { Send, Clock, Eye, Copy, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number>();
  const [maxViews, setMaxViews] = useState<number>();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

const handleSubmit = async () => {
    if(!content) return setError("Content cannot be empty")

    setLoading(true);
    setError(null);
     await createPaste({ content, ttl, maxViews })
     .then((res) =>setUrl(res.url))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
};

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Paste</h1>
        <p className="text-gray-500 mt-2">Securely share code or text with expiration limits.</p>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        {/* Main Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
          <textarea
            placeholder="Paste your code or text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all outline-none resize-none"
          />
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Clock size={16} className="text-gray-400" /> Expiration (Seconds)
            </label>
            <input
              type="number"
              placeholder="Optional (e.g. 3600)"
              value={ttl ?? ""}
              onChange={(e) => setTtl(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Eye size={16} className="text-gray-400" /> Max Views
            </label>
            <input
              type="number"
              placeholder="Optional (e.g. 5)"
              value={maxViews ?? ""}
              onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          {loading ? "Creating Paste..." : "Generate Secure Link"}
        </button>

        {/* Success / Result State */}
        {url && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 text-emerald-800 font-bold mb-3">
              <CheckCircle2 size={18} />
              Paste Created Successfully!
            </div>
           <div className="flex items-center gap-2 bg-white border border-emerald-200 p-2 rounded-lg shadow-sm">
  {/* The URL - Now a clickable link */}
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex-1 text-sm text-blue-600 hover:text-blue-800 hover:underline px-2 font-medium truncate transition-colors"
    title="Open link in new tab"
  >
    {url}
  </a>

  <div className="flex items-center gap-1 border-l border-emerald-100 pl-1">
    {/* Copy Button */}
    <button 
      onClick={copyToClipboard}
      className="p-2 hover:bg-emerald-50 rounded-md transition-colors text-gray-500 group"
      title="Copy to clipboard"
    >
      {copied ? (
        <CheckCircle2 size={18} className="text-emerald-600" />
      ) : (
        <Copy size={18} className="group-hover:text-emerald-600" />
      )}
    </button>

    {/* Direct 'Go to' Button */}
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 hover:bg-emerald-50 rounded-md transition-colors text-gray-500 group"
      title="Visit URL"
    >
      <ExternalLink size={18} className="group-hover:text-blue-600" />
    </a>
  </div>
</div>
          </div>
        )}

        {/* Error Handling */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle size={18} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}