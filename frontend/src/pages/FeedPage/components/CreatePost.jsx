import { useState } from "react";
import "./CreatePost.css";
import { useSelector } from "react-redux";

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false); // 👈 NEW
  const { path } = useSelector((state) => state.path);
   const host = localStorage.getItem("api") || path;

  const handleSubmit = async () => {
    
    if (loading) return; // prevent double click

    setLoading(true); // 👈 start uploading state

    try {
      // 1. create post
      const res = await fetch(`${host}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({ content })
      });

      const data = await res.json();
      const postId = data.post_id;

      // 2. upload media if exists
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));

        await fetch(`${host}/posts/${postId}/media`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          },
          body: formData
        });
      }

      // reset
      setContent("");
      setFiles([]);

      // refresh feed
      onPostCreated();

    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false); // 👈 always reset
    }
  };

  return (
    <div className="create-post">
      <textarea
        placeholder="What did you learn today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <button
        className="cyber-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Post"}
      </button>
    </div>
  );
}