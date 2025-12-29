import { useState } from "react";
import api from "./instance/axios";

function App() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  async function createPaste() {


    try {
        const res=await api.post("/api/pastes",{
      content 
    })

      const data = await res.data;
      setUrl(data.url);

    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <textarea
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={createPaste}>Create Paste</button>
      {url && <p><a href={url}>{url}</a></p>}
    </div>
  );
}

export default App;
