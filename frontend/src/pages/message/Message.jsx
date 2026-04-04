import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Message.css"; // new CSS file

export function Message() {
  const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;

  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState("MEDIA VAULT");
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");

  const navigate = useNavigate();

  // Fetch protected message
  useEffect(() => {
    async function fetchMessage() {
      try {
        const token = localStorage.getItem("jwt");
        const storedUsername = localStorage.getItem("username") || "";
        setUsername(storedUsername);

        if (!token) return navigate("/login");

        const response = await fetch(`${host}/message`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) return navigate("/login");

        const data = await response.json();
        setText(data.text || "");
        if (data.message) setMessageText(data.message);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    }

    fetchMessage();
  }, [navigate, path]);

  // Fetch media files
  useEffect(() => {
    async function fetchMedia() {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return navigate("/login");

        const response = await fetch(`${host}/all-images`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch media files");

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setMediaFiles(data.files || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, [navigate, path]);

  // 🔥 Skeleton screen while loading
  if (loading)
    return (
      <div className="gallery-container">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
        <div className="grid">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="card skeleton-card">
              <div className="skeleton skeleton-media"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="gallery-container">
        <p className="error">Error: {error}</p>
      </div>
    );

  return (
    <div className="gallery-container">
      <h1 className="title">{messageText}</h1>
      {username && <h2 className="username">Welcome, {username}!</h2>}
      {text && <div className="message-text">{text}</div>}

      {mediaFiles.length === 0 ? (
        <p className="no-media">No media files available.</p>
      ) : (
        <div className="grid">
          {mediaFiles.map((file, index) => {
            const ext = file.key.split(".").pop().toLowerCase();
            return (
              <div key={index} className="card">
                {["jpg", "jpeg", "png", "gif", "webp"].includes(ext) && (
                  <img src={file.url} alt={file.key} className="media" />
                )}
                {["mp4", "webm", "ogg"].includes(ext) && (
                  <video src={file.url} controls className="media" />
                )}
                {["mp3", "wav", "ogg"].includes(ext) && (
                  <audio src={file.url} controls className="media-audio" />
                )}
                <p className="file-name">{file.key}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}