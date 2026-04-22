import React from "react";

export function ImageCanvasRenderer({ data }) {
  if (!data?.image) return null;

  const { image, ratio, rects = [] } = data;

  return (
    <div
      style={{
        width: "100vw",
        aspectRatio: ratio,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        border: "2px solid red",
      }}
    >
      {rects.map((r) => (
        <div
          key={r.id}
          style={{
            position: "absolute",
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: `${r.width}%`,
            height: `${r.height}%`,
            background: "rgba(255, 0, 0, 1)",
            border: "1px solid black",
            borderRadius: 12,
            boxSizing: "border-box",
            color: "white",
            fontSize: 10,
            padding: 4,
            overflow: "hidden",
          }}
        />
      ))}
    </div>
  );
}