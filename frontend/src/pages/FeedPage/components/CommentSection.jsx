import { useEffect, useState } from "react";
import "./CommentSection.css";
import { useSelector } from "react-redux";

export default function CommentSection({ postId }) {
  const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`${host}/posts/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      }
    });
    const data = await res.json();
    setComments(data);
  };

  const addComment = async () => {
    await fetch(`${host}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({ content })
    });

    setContent("");
    fetchComments();
  };

  useEffect(() => {
    () => (fetchComments())();
    
  }, []);

  return (
    <div className="comment-section">
      {comments.map(c => (
        <p key={c.id} className="comment">{c.content}</p>
      ))}

      <div className="comment-input">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add comment"
        />
        <button className="cyber-btn" onClick={addComment}>
          Send
        </button>
      </div>
    </div>
  );
}