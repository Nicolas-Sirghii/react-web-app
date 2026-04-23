import React, { useRef, useState, useEffect } from "react";

export function ImageCanvasEditor() {
  const containerRef = useRef(null);

  // ---------------- IMAGE ----------------
  const [image, setImage] = useState(null);
  const [ratio, setRatio] = useState(1);

  // ---------------- RECTANGLES ----------------
  const [rects, setRects] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // ---------------- MODE ----------------
  const mode = useRef("idle");
  const pointerId = useRef(null);

  // ---------------- LIVE POINTER STATE ----------------
  const pointers = useRef(new Map());

  // ---------------- GESTURE STATE ----------------
  const gesture = useRef({
    active: false,
    startDistance: 0,
    startScale: 1,
    startMid: { x: 0, y: 0 },
    startTransform: { x: 0, y: 0 },
  });

  // ---------------- TRANSFORM ----------------
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  // ---------------- TEMP DRAG STATE ----------------
  const start = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  const createId = () => Date.now() + Math.random();

  // ---------------- IMAGE ----------------
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
  const getPoint = (e) => ({ x: e.clientX, y: e.clientY });

  const distance = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const midpoint = (a, b) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const clamp = (v, min, max) =>
    Math.max(min, Math.min(max, v));

  // ---------------- WORLD SPACE ----------------
  const getWorldPoint = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left - transform.x) / transform.scale,
      y: (e.clientY - rect.top - transform.y) / transform.scale,
    };
  };

  // ---------------- RESET EVERYTHING (IMPORTANT FIX) ----------------
  const resetPointers = () => {
    pointers.current.clear();
    gesture.current.active = false;
    mode.current = "idle";
    pointerId.current = null;
  };

  useEffect(() => {
    window.addEventListener("blur", resetPointers);
    return () => window.removeEventListener("blur", resetPointers);
  }, []);

  // ---------------- POINTER DOWN ----------------
  const onPointerDown = (e) => {
    const p = getPoint(e);
    pointers.current.set(e.pointerId, p);

    // 👉 GESTURE START
    if (pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];

      gesture.current.active = true;
      gesture.current.startDistance = distance(p1, p2);
      gesture.current.startMid = midpoint(p1, p2);
      gesture.current.startScale = transform.scale;
      gesture.current.startTransform = {
        x: transform.x,
        y: transform.y,
      };

      mode.current = "gesture";
      setActiveId(null);
      return;
    }

    // 👉 BLOCK accidental draw during multi-touch
    if (pointers.current.size > 1) return;

    if (!image) return;

    const { x, y } = getWorldPoint(e);

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
  };

  // ---------------- POINTER MOVE ----------------
  const onPointerMove = (e) => {
    const p = getPoint(e);
    pointers.current.set(e.pointerId, p);

    // ---------------- GESTURE ----------------
    if (gesture.current.active && pointers.current.size === 2) {
      const [p1, p2] = [...pointers.current.values()];

      const newDistance = distance(p1, p2);
      const newMid = midpoint(p1, p2);

      const scaleFactor =
        newDistance / gesture.current.startDistance;

      setTransform({
        scale: gesture.current.startScale * scaleFactor,
        x:
          gesture.current.startTransform.x +
          (newMid.x - gesture.current.startMid.x),
        y:
          gesture.current.startTransform.y +
          (newMid.y - gesture.current.startMid.y),
      });

      return;
    }

    // ---------------- RECT EDIT ----------------
    if (pointerId.current !== e.pointerId) return;

    const { x, y } = getWorldPoint(e);

    setRects((prev) =>
      prev.map((r) => {
        if (r.id !== activeId) return r;

        // DRAW (FIXED NORMALIZATION)
        if (mode.current === "draw") {
          const x1 = Math.min(x, start.current.x);
          const y1 = Math.min(y, start.current.y);

          return {
            ...r,
            x: x1,
            y: y1,
            width: Math.abs(x - start.current.x),
            height: Math.abs(y - start.current.y),
          };
        }

        // DRAG (FIXED STABILITY)
        if (mode.current === "drag") {
          const newX = x - offset.current.x;
          const newY = y - offset.current.y;

          return {
            ...r,
            x: newX,
            y: newY,
          };
        }

        // RESIZE (FIXED DIRECTION SAFETY)
        if (mode.current === "resize") {
          const x1 = Math.min(r.x, x);
          const y1 = Math.min(r.y, y);

          return {
            ...r,
            x: x1,
            y: y1,
            width: Math.abs(x - r.x),
            height: Math.abs(y - r.y),
          };
        }

        return r;
      })
    );
  };

  // ---------------- POINTER UP ----------------
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);

    if (pointers.current.size < 2) {
      gesture.current.active = false;
    }

    mode.current = "idle";
    pointerId.current = null;

    setRects((prev) =>
      prev.filter((r) => r.width > 2 && r.height > 2)
    );
  };

  // ---------------- DRAG ----------------
  const startDrag = (e, r) => {
    e.stopPropagation();

    setActiveId(r.id);
    mode.current = "drag";

    const { x, y } = getWorldPoint(e);

    offset.current = {
      x: x - r.x,
      y: y - r.y,
    };

    pointerId.current = e.pointerId;
  };

  // ---------------- RESIZE ----------------
  const startResize = (e, r) => {
    e.stopPropagation();

    setActiveId(r.id);
    mode.current = "resize";
    pointerId.current = e.pointerId;
  };

  // ---------------- FIELD UPDATE ----------------
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
        {
          image,
          ratio,
          transform,
          rects,
        },
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
          background: "#111",
        }}
      >
        {/* WORLD LAYER */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            backgroundImage: image ? `url(${image})` : "none",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {rects.map((r) => (
            <div
              key={r.id}
              onPointerDown={(e) => startDrag(e, r)}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.width,
                height: r.height,
                background: "rgba(255,0,0,0.5)",
                borderRadius: 10,
              }}
            >
              <div
                onPointerDown={(e) => startResize(e, r)}
                style={{
                  width: 14,
                  height: 14,
                  background: "white",
                  position: "absolute",
                  right: 2,
                  bottom: 2,
                  borderRadius: 3,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* INPUTS + EXPORT */}
      <div style={{ marginTop: 20 }}>
        {rects.map((r) => (
          <div key={r.id}>
            <input
              value={r.field1}
              onChange={(e) =>
                updateField(r.id, "field1", e.target.value)
              }
              placeholder="Field 1"
            />
            <input
              value={r.field2}
              onChange={(e) =>
                updateField(r.id, "field2", e.target.value)
              }
              placeholder="Field 2"
            />
          </div>
        ))}

        {rects.length > 0 && (
          <button onClick={handleSubmit}>
            Export Layout
          </button>
        )}
      </div>
    </div>
  );
}