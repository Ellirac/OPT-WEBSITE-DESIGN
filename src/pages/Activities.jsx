import React, { useState, useMemo, useEffect } from "react";
import "../styles/activities.css";
import { useCMS } from "../admin/context/CMSContext";

const Activities = () => {
  const { state }   = useCMS();
  const folders     = state.activities.folders || [];
  const allPosts    = state.activities.posts   || [];

  const [activeVideo,    setActiveVideo]    = useState(null);
  const [activeFolder,   setActiveFolder]   = useState('all');
  const [activeType,     setActiveType]     = useState('all');
  const [activeYear,     setActiveYear]     = useState('all');

  // Close modal on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') setActiveVideo(null); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  // Unique years from posts
  const years = useMemo(() => {
    const ys = [...new Set(allPosts.map(p => p.date?.slice(0,4)).filter(Boolean))].sort().reverse();
    return ys;
  }, [allPosts]);

  // Unique types
  const types = useMemo(() => [...new Set(allPosts.map(p=>p.category).filter(Boolean))], [allPosts]);

  // Filtered posts
  const filtered = useMemo(() => {
    return allPosts.filter(p => {
      if (activeFolder !== 'all' && p.folderId !== activeFolder) return false;
      if (activeType   !== 'all' && p.category !== activeType)   return false;
      if (activeYear   !== 'all' && !p.date?.startsWith(activeYear)) return false;
      return true;
    });
  }, [allPosts, activeFolder, activeType, activeYear]);

  const folderName = id => folders.find(f=>f.id===id)?.name || '';

  return (
    <div className="activities-neo">
      <div className="container">

        {/* Header */}
        <div className="activities-header">
          <h2>Company Activities</h2>
          <p>Watch highlights of our corporate events and initiatives</p>
        </div>

        {/* Folder tabs */}
        {folders.length > 0 && (
          <div className="act-folder-tabs">
            {folders.map(f => {
              const count = allPosts.filter(p=>p.folderId===f.id).length;
              return (
                <button key={f.id}
                  className={`act-folder-tab${activeFolder===f.id?' active':''}`}
                  onClick={() => setActiveFolder(f.id)}
                >
                  📁 {f.name}
                  <span className="act-folder-count">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Videos grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🎬</div>
            <p style={{ fontSize:16 }}>No videos found for the selected filters.</p>
          </div>
        ) : (
          <div className="row">
            {filtered.map(item => (
              <div key={item.id} className="col-md-4 col-sm-6 mb-4">
                <div className="video-card" onClick={() => setActiveVideo(item)}>
                  <div className="video-card-inner">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                    />
                  </div>
                  <div className="video-overlay">
                    <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
                      <span className="video-tag">{item.category}</span>
                      {item.folderId && folderName(item.folderId) && (
                        <span className="video-tag" style={{ background:'rgba(255,255,255,0.12)' }}>
                          📁 {folderName(item.folderId)}
                        </span>
                      )}
                    </div>
                    <h5>{item.title}</h5>
                    {item.date && (
                      <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:'4px 0 0' }}>
                        {new Date(item.date + 'T00:00:00').toLocaleDateString('en-PH',{ year:'numeric', month:'long', day:'numeric' })}
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
          <div className="video-modal-box" onClick={e => e.stopPropagation()}>
            <button className="video-close" onClick={() => setActiveVideo(null)}>
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
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