import React, { useRef, useState } from "react";
import "./canvas.css";

export function ImageCanvasEditor() {
  const containerRef = useRef(null);

  const [image, setImage] = useState(null);
  const [ratio, setRatio] = useState(1);

  const [rects, setRects] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // ---------------- ZOOM ----------------
  const [scale, setScale] = useState(1);
  const lastDistance = useRef(null);
  const isPinching = useRef(false);

  // ---------------- DELETE ----------------
  const [deleteTarget, setDeleteTarget] = useState(null);
  const holdTimer = useRef(null);

  // ---------------- EDIT MODE ----------------
  const mode = useRef("idle");
  const start = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const pointerId = useRef(null);

  const createId = () => Date.now() + Math.random();

  // ---------------- IMAGE LOAD ----------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      setRatio(img.width / img.height);
      setImage(url);
    };

    img.src = url;
  };

  // ---------------- HELPERS ----------------
  const getPercent = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const getDistance = (t1, t2) =>
    Math.hypot(
      t2.clientX - t1.clientX,
      t2.clientY - t1.clientY
    );

  // ---------------- PINCH ZOOM ----------------
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      lastDistance.current = getDistance(
        e.touches[0],
        e.touches[1]
      );
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      isPinching.current = true;

      const dist = getDistance(
        e.touches[0],
        e.touches[1]
      );

      if (lastDistance.current) {
        const delta = dist / lastDistance.current;

        setScale((prev) =>
          clamp(prev * delta, 0.5, 3)
        );

        lastDistance.current = dist;
      }
    }
  };

  const onTouchEnd = (e) => {
    if (e.touches.length < 2) {
      isPinching.current = false;
      lastDistance.current = null;
    }
  };

  // ---------------- CREATE RECT ----------------
  const onPointerDownCanvas = (e) => {
    if (isPinching.current) return;

    if (e.target.dataset.type) return;
    if (!image) return;

    const { x, y } = getPercent(e);

    start.current = { x, y };

    const id = createId();

    setRects((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        width: 0,
        height: 0,
        field1: "",
        field2: "",
      },
    ]);

    setActiveId(id);
    mode.current = "draw";

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  // ---------------- MOVE ----------------
  const onPointerMove = (e) => {
    if (isPinching.current) return;

    if (pointerId.current !== e.pointerId) return;

    const { x: mx, y: my } = getPercent(e);

    setRects((prev) =>
      prev.map((r) => {
        if (r.id !== activeId) return r;

        if (mode.current === "draw") {
          const width = Math.abs(mx - start.current.x);
          const height = Math.abs(my - start.current.y);

          if (width < 1 || height < 1) return r;

          return {
            ...r,
            x: Math.min(mx, start.current.x),
            y: Math.min(my, start.current.y),
            width,
            height,
          };
        }

        if (mode.current === "drag") {
          const newX = mx - offset.current.x;
          const newY = my - offset.current.y;

          return {
            ...r,
            x: clamp(newX, 0, 100 - r.width),
            y: clamp(newY, 0, 100 - r.height),
          };
        }

        if (mode.current === "resize") {
          return {
            ...r,
            width: clamp(mx - r.x, 2, 100 - r.x),
            height: clamp(my - r.y, 2, 100 - r.y),
          };
        }

        return r;
      })
    );
  };

  // ---------------- STOP ----------------
  const onPointerUp = () => {
    mode.current = "idle";
    pointerId.current = null;

    setRects((prev) =>
      prev.filter((r) => r.width > 1 && r.height > 1)
    );
  };

  // ---------------- DRAG + HOLD DELETE ----------------
  const startDrag = (e, r) => {
    if (isPinching.current) return;

    e.stopPropagation();

    setActiveId(r.id);
    mode.current = "drag";

    const { x, y } = getPercent(e);

    offset.current = {
      x: x - r.x,
      y: y - r.y,
    };

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    // ---------------- HOLD TO DELETE ----------------
    holdTimer.current = setTimeout(() => {
      setDeleteTarget(r);
    }, 600);
  };

  const stopHold = () => {
    clearTimeout(holdTimer.current);
  };

  // ---------------- RESIZE ----------------
  const startResize = (e, r) => {
    if (isPinching.current) return;

    e.stopPropagation();

    setActiveId(r.id);
    mode.current = "resize";

    pointerId.current = e.pointerId;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  // ---------------- DELETE ----------------
  const deleteRect = (id) => {
    setRects((prev) => prev.filter((r) => r.id !== id));
    setActiveId(null);
  };

  // ---------------- INPUT UPDATE ----------------
  const updateField = (id, field, value) => {
    setRects((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };

  // ---------------- EXPORT ----------------
  const handleSubmit = () => {
    console.log(
      JSON.stringify(
        { image, ratio, rects },
        null,
        2
      )
    );
  };

  return (
    <div>
      <input type="file" onChange={handleImage} />

      {/* CANVAS */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDownCanvas}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          width: "100vw",
          aspectRatio: ratio,
          position: "relative",
          overflow: "hidden",
          userSelect: "none",
          touchAction: "none",

          transform: `scale(${scale})`,
          transformOrigin: "center",

          backgroundImage: image ? `url(${image})` : "none",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {rects.map((r) => (
          <div
            key={r.id}
            data-type="box"
            onPointerDown={(e) => startDrag(e, r)}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            style={{
              position: "absolute",
              left: `${r.x}%`,
              top: `${r.y}%`,
              width: `${r.width}%`,
              height: `${r.height}%`,
              background:
                r.id === activeId
                  ? "rgba(255,0,0,0.5)"
                  : "rgba(255,0,0,1)",
              borderRadius: 12,
              color: "white",
              fontSize: 10,
              padding: 4,
              boxSizing: "border-box",
              outline:
                r.id === activeId
                  ? "2px solid white"
                  : "none",
              touchAction: "none",
            }}
          >
            <div
              data-type="resize"
              onPointerDown={(e) => startResize(e, r)}
              style={{
                width: 16,
                height: 16,
                background: "white",
                position: "absolute",
                right: 2,
                bottom: 2,
                borderRadius: 4,
              }}
            />
          </div>
        ))}
      </div>

      {/* INPUTS */}
      <div style={{ marginTop: 20 }}>
        {rects.map((r) => (
          <div
            key={r.id}
            style={{
              padding: 10,
              display: "flex",
              gap: "10px",
              border:
                r.id === activeId
                  ? "2px solid red"
                  : "1px solid #ccc",
              marginBottom: 10,
            }}
          >
            <input
              value={r.field1}
              onChange={(e) =>
                updateField(r.id, "field1", e.target.value)
              }
            />
            <input
              value={r.field2}
              onChange={(e) =>
                updateField(r.id, "field2", e.target.value)
              }
            />
          </div>
        ))}

        {rects.length > 0 && (
          <button onClick={handleSubmit}>
            Export Layout
          </button>
        )}
      </div>

      {/* DELETE POPUP */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#111",
              padding: 20,
              borderRadius: 10,
              color: "white",
              textAlign: "center",
            }}
          >
            <p>Delete this box?</p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => {
                  deleteRect(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Yes
              </button>

              <button onClick={() => setDeleteTarget(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}