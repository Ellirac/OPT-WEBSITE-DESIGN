import React, { useState, useMemo, useEffect } from "react";
import "../styles/activities.css";
import { useCMS } from "../admin/context/CMSContext";

const Activities = () => {
  const { state } = useCMS();

  const folders = state.activities.folders || [];

  const allPosts = useMemo(
    () => state.activities.posts || [],
    [state.activities.posts]
  );

  const [activeVideo, setActiveVideo]   = useState(null);
  const [activeFolder, setActiveFolder] = useState("all");
  const [activeType, setActiveType]     = useState("all");
  const [activeYear, setActiveYear]     = useState("all");

  // Close modal on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setActiveVideo(null); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // Disable scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = activeVideo ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo]);

  // Unique years derived from allPosts
  const years = useMemo(
    () =>
      [...new Set(allPosts.map((p) => p.date?.slice(0, 4)).filter(Boolean))]
        .sort()
        .reverse(),
    [allPosts]
  );

  // Unique types derived from allPosts
  const types = useMemo(
    () => [...new Set(allPosts.map((p) => p.category).filter(Boolean))],
    [allPosts]
  );

  // Filter logic
  const filtered = useMemo(
    () =>
      allPosts.filter((p) => {
        if (activeFolder !== "all" && p.folderId !== activeFolder) return false;
        if (activeType   !== "all" && p.category  !== activeType)  return false;
        if (activeYear   !== "all" && !p.date?.startsWith(activeYear)) return false;
        return true;
      }),
    [allPosts, activeFolder, activeType, activeYear]
  );

  const folderName = (id) => folders.find((f) => f.id === id)?.name || "";

  return (
    <div className="activities-neo">
      <div className="container">

        {/* Header */}
        <div className="activities-header">
          <h2>Company Activities</h2>
          <p>Watch highlights of our corporate events and initiatives</p>
        </div>

        {/* Filters */}
        <div className="act-filters">

          {/* Folder tabs */}
          <div className="act-folder-tabs">
            <button
              className={`act-folder-tab ${activeFolder === "all" ? "active" : ""}`}
              onClick={() => setActiveFolder("all")}
            >
              📁 All
            </button>
            {folders.map((f) => {
              const count = allPosts.filter((p) => p.folderId === f.id).length;
              return (
                <button
                  key={f.id}
                  className={`act-folder-tab ${activeFolder === f.id ? "active" : ""}`}
                  onClick={() => setActiveFolder(f.id)}
                >
                  📁 {f.name}
                  <span className="act-folder-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Type filter */}
          <select
            className="act-select"
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
          >
            <option value="all">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Year filter */}
          <select
            className="act-select"
            value={activeYear}
            onChange={(e) => setActiveYear(e.target.value)}
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

        </div>

        {/* Videos grid */}
        {filtered.length === 0 ? (
          <div className="act-empty">
            <div className="act-empty-icon">🎬</div>
            <p>No videos found.</p>
          </div>
        ) : (
          <div className="row">
            {filtered.map((item) => (
              <div key={item.id} className="col-md-4 col-sm-6 mb-4">
                <div className="video-card" onClick={() => setActiveVideo(item)}>
                  <div className="video-card-inner">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                    />
                  </div>
                  <div className="video-overlay">
                    <div className="video-tags">
                      <span className="video-tag">{item.category}</span>
                      {item.folderId && folderName(item.folderId) && (
                        <span className="video-tag folder">
                          📁 {folderName(item.folderId)}
                        </span>
                      )}
                    </div>
                    <h5>{item.title}</h5>
                    {item.date && (
                      <p className="video-date">
                        {new Date(item.date + "T00:00:00").toLocaleDateString("en-PH", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="play-btn">▶</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Video modal */}
      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <div className="video-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" onClick={() => setActiveVideo(null)}>
              ✕ EXIT
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
              title={activeVideo.title}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;