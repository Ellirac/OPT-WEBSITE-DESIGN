import React, { useState, useMemo, useEffect } from "react";
import "../styles/activities.css";
import { useCMS } from "../admin/context/CMSContext";

const Activities = () => {
  const { state } = useCMS();

  const folders = useMemo(
    () => state.activities.folders || [],
    [state.activities.folders]
  );

  const allPosts = useMemo(
    () => state.activities.posts || [],
    [state.activities.posts]
  );

  const allImages = useMemo(
    () => state.activities.images || [],
    [state.activities.images]
  );

  // Merge items
  const allItems = useMemo(() => {
    const videos = allPosts.map(p => ({
      ...p,
      type: p.driveUrl ? "drive_video" : p.videoSrc ? "local_video" : "youtube",
    }));

    const images = allImages.map(i => ({
      ...i,
      type: "image",
    }));

    return [...videos, ...images].sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      return 0;
    });
  }, [allPosts, allImages]);

  const [activeItem, setActiveItem] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);

  // Auto select first folder
  useEffect(() => {
    if (folders.length > 0 && !activeFolder) {
      setActiveFolder(folders[0].id);
    }
  }, [folders, activeFolder]);

  useEffect(() => {
    const h = e => {
      if (e.key === "Escape") setActiveItem(null);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeItem]);

  // Filter ONLY by folder
  const filtered = useMemo(() => {
    if (!activeFolder) return [];
    return allItems.filter(item => item.folderId === activeFolder);
  }, [allItems, activeFolder]);

  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d + "T00:00:00").toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  const driveImgUrl = (item, size = "w800") =>
    item.driveFileId
      ? `https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=${size}`
      : item.src || "";

  const Thumbnail = ({ item }) => {
    if (item.type === "image") {
      return (
        <img
          src={driveImgUrl(item, "w600")}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }

    if (item.type === "youtube") {
      return (
        <img
          src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }

    if (item.type === "drive_video") {
      return (
        <img
          src={`https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=w400`}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }

    return (
      <video
        src={item.videoSrc}
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  };

  const typeBadge = (item) => {
    if (item.type === "image") return { label: "🖼 Photo", bg: "rgba(52,152,219,0.8)" };
    if (item.type === "drive_video") return { label: "🎬 Video", bg: "rgba(142,68,173,0.8)" };
    if (item.type === "local_video") return { label: "🎬 Video", bg: "rgba(142,68,173,0.8)" };
    return { label: "▶ YouTube", bg: "rgba(192,57,43,0.8)" };
  };

  return (
    <div className="activities-neo">
      <div className="container">

        {/* Header */}
        <div className="activities-header">
          <h2>Company Activities</h2>
          <p>Explore our corporate events, CSR initiatives, and company highlights</p>
        </div>

        {/* Folder Tabs */}
        {folders.length > 0 && (
          <div className="act-folder-tabs">
            {folders.map(f => {
              const count = allItems.filter(i => i.folderId === f.id).length;

              return (
                <button
                  key={f.id}
                  className={`act-folder-tab${activeFolder === f.id ? " active" : ""}`}
                  onClick={() => setActiveFolder(f.id)}
                >
                  📁 {f.name}
                  <span className="act-folder-count">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <p style={{ fontSize: 16 }}>No items in this folder.</p>
          </div>
        ) : (
          <div className="row">
            {filtered.map(item => {
              const badge = typeBadge(item);

              return (
                <div key={item.id} className="col-md-4 col-sm-6 mb-4">
                  <div className="video-card" onClick={() => setActiveItem(item)}>

                    <div className="video-card-inner">
                      <Thumbnail item={item} />
                    </div>

                    <div className="video-overlay">
                      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                        <span className="video-tag" style={{ background: badge.bg }}>
                          {badge.label}
                        </span>
                      </div>

                      <h5>{item.title}</h5>

                      {item.date && (
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>
                          {formatDate(item.date)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            background: "rgba(0,0,0,0.93)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: activeItem.type === "image" ? 860 : 960,
              position: "relative"
            }}
          >

            {/* ✅ FIXED EXIT BUTTON */}
            <button
              onClick={() => setActiveItem(null)}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(0,0,0,0.6)")
              }
            >
              ✕
            </button>

            <div style={{ marginBottom: 14 }}>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>
                {activeItem.title}
              </div>

              {activeItem.date && (
                <div style={{ color: "rgba(255,255,255,0.45)" }}>
                  {formatDate(activeItem.date)}
                </div>
              )}
            </div>

            {activeItem.type === "youtube" && (
              <iframe
                src={`https://www.youtube.com/embed/${activeItem.youtubeId}?autoplay=1`}
                title={activeItem.title}
                style={{ width: "100%", height: "500px" }}
                allowFullScreen
              />
            )}

            {activeItem.type === "drive_video" && (
              <iframe
                src={`https://drive.google.com/file/d/${activeItem.driveFileId}/preview`}
                title={activeItem.title}
                style={{ width: "100%", height: "500px" }}
                allow="autoplay"
              />
            )}

            {activeItem.type === "local_video" && (
              <video src={activeItem.videoSrc} controls autoPlay style={{ width: "100%" }} />
            )}

            {activeItem.type === "image" && (
              <img
                src={driveImgUrl(activeItem, "w1600")}
                alt={activeItem.title}
                style={{ width: "100%" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;