import { useState } from "react";
import "./PostCard.css";
import { useSelector } from "react-redux";

import MediaRenderer from "./MediaRenderer";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onRefresh }) {
  // console.log(post.comments_count)
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(post.content);
   const { path } = useSelector((state) => state.path);
   const host = localStorage.getItem("api") || path;

  const saveEdit = async () => {
    await fetch(`${host}/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({ content: text })
    });

    setEdit(false);
    onRefresh();
  };

  const deletePost = async () => {
    await fetch(`${host}/posts/${post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      }
    });

    onRefresh();
  };

  return (
    <div className="post-card">
      {edit ? (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={saveEdit} className="cyber-btn">Save</button>
        </>
      ) : (
        <p>{post.content}</p>
      )}

      <MediaRenderer media={post.media} />

      <div className="actions">
        <button className="cyber-btn" onClick={() => setEdit(!edit)}>
          Edit
        </button>

        <button className="cyber-btn danger" onClick={deletePost}>
          Delete
        </button>

        <button className="cyber-btn" onClick={() => setShow(!show)}>
          Comments{post.comments_count}
        </button>
      </div>

      {show && <CommentSection postId={post.id} />}
    </div>
  );
}