import "./MediaRenderer.css";

export default function MediaRenderer({ media }) {
  if (!media) return null;

  return (
    <div className="media-container">
      {media.map(item => {
        if (item.type === "image") {
          return <img key={item.id} src={item.url} />;
        }
        if (item.type === "video") {
          return <video key={item.id} src={item.url} controls />;
        }
        return null;
      })}
    </div>
  );
}