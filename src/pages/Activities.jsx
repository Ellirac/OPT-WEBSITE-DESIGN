import React, { useState, useEffect } from "react";
import "../styles/activities.css";
import { useCMS } from "../admin/context/CMSContext";

const Activities = () => {
  const { state } = useCMS();
  const activities = state.activities.posts;
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setActiveVideo(null); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeVideo ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo]);

  return (
    <div className="activities-neo">
      <div className="container">
        <div className="activities-header">
          <h2>Company Activities</h2>
          <p>Watch highlights of our corporate events and initiatives</p>
        </div>

        <div className="row">
          {activities.map((item) => (
            <div key={item.id} className="col-md-4 col-sm-6 mb-4">
              <div className="video-card" onClick={() => setActiveVideo(item)}>
                <div className="video-card-inner">
                  <img
                    src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                    alt={item.title}
                  />
                </div>
                <div className="video-overlay">
                  <span className="video-tag">{item.category}</span>
                  <h5>{item.title}</h5>
                </div>
                <div className="play-btn">▶</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <div className="video-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="video-close" onClick={() => setActiveVideo(null)} aria-label="Close video">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="video-close-text">EXIT</span>
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
