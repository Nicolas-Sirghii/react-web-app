import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./getImages.css"; // new CSS file

export function UserImages({ userId }) {
  const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserId = userId || localStorage.getItem("user_id") || 0;

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`${host}/a/list-images?user_id=${fetchUserId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        console.log("Fetched URLs:", data.urls);

        if (data.urls) {
          setImages(data.urls);
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [fetchUserId, host]);

  if (loading)
    return (
      <div className="user-images-container">
        <div className="skeleton-grid">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="skeleton-card">
              <div className="skeleton skeleton-image"></div>
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return <p className="error">Error loading images: {error}</p>;

  if (images.length === 0)
    return <p className="no-images">No images found for user {fetchUserId}.</p>;

  return (
    <div className="user-images-container">
      <div className="user-images-grid">
        {images.map((url, idx) => (
          <div key={idx} className="user-image-card">
            <img src={url} alt={`user-${fetchUserId}-image-${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
}