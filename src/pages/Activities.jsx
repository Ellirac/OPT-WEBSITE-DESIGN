import React, { useState, useMemo, useEffect } from "react";
import "../styles/activities.css";
import { useCMS } from "../admin/context/CMSContext";

const Activities = () => {
  const { state } = useCMS();

  const folders   = state.activities.folders || [];
  const allPosts  = useMemo(() => state.activities.posts  || [], [state.activities.posts]);
  const allImages = useMemo(() => state.activities.images || [], [state.activities.images]);

  // Merge everything — detect drive video, local video, or youtube
  const allItems = useMemo(() => {
    const videos = allPosts.map(p => ({
      ...p,
      type: p.driveUrl ? 'drive_video' : p.videoSrc ? 'local_video' : 'youtube',
    }));
    const images = allImages.map(i => ({ ...i, type: 'image' }));
    return [...videos, ...images].sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      return 0;
    });
  }, [allPosts, allImages]);

  const [activeItem,      setActiveItem]      = useState(null);
  const [activeFolder,    setActiveFolder]    = useState('all');
  const [activeMediaType, setActiveMediaType] = useState('all');
  const [activeYear,      setActiveYear]      = useState('all');

  useEffect(() => {
    const h = e => { if (e.key === 'Escape') setActiveItem(null); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = activeItem ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeItem]);

  const years = useMemo(() => {
    const ys = [...new Set(allItems.map(i => i.date?.slice(0,4)).filter(Boolean))].sort().reverse();
    return ys;
  }, [allItems]);

  const filtered = useMemo(() => allItems.filter(item => {
    if (activeFolder !== 'all' && item.folderId !== activeFolder) return false;
    if (activeMediaType === 'video' && item.type === 'image')     return false;
    if (activeMediaType === 'image' && item.type !== 'image')     return false;
    if (activeYear !== 'all' && !item.date?.startsWith(activeYear)) return false;
    return true;
  }), [allItems, activeFolder, activeMediaType, activeYear]);

  const folderName = id => folders.find(f => f.id === id)?.name || '';
  const videoCount = allItems.filter(i => i.type !== 'image').length;
  const imageCount = allItems.filter(i => i.type === 'image').length;

  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d + 'T00:00:00').toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' }); }
    catch { return d; }
  };

  // Thumbnail for grid card
  const Thumbnail = ({ item }) => {
    if (item.type === 'image') {
      return <img src={item.src} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />;
    }
    if (item.type === 'youtube') {
      return <img src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />;
    }
    if (item.type === 'drive_video') {
      // Show Drive thumbnail using the file ID
      return (
        <img
          src={`https://drive.google.com/thumbnail?id=${item.driveFileId}&sz=w400`}
          alt={item.title}
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => {
            // fallback to a dark placeholder if thumbnail not available
            e.target.style.display = 'none';
            e.target.parentNode.style.background = '#1a0000';
          }}
        />
      );
    }
    // local video — show first frame
    return (
      <video src={item.videoSrc} muted playsInline
        style={{ width:'100%', height:'100%', objectFit:'cover' }}
        onLoadedData={e => e.target.currentTime = 1} />
    );
  };

  // Play / action icon overlay
  const ActionIcon = ({ item }) => {
    if (item.type === 'image') return <div className="play-btn" style={{ fontSize:20 }}>🔍</div>;
    return <div className="play-btn">▶</div>;
  };

  // Type badge
  const typeBadge = (item) => {
    if (item.type === 'image')       return { label:'🖼 Photo',   bg:'rgba(52,152,219,0.8)' };
    if (item.type === 'drive_video') return { label:'🎬 Video',   bg:'rgba(142,68,173,0.8)' };
    if (item.type === 'local_video') return { label:'🎬 Video',   bg:'rgba(142,68,173,0.8)' };
    return                                  { label:'▶ YouTube', bg:'rgba(192,57,43,0.8)' };
  };

  return (
    <div className="activities-neo">
      <div className="container">

        {/* Header */}
        <div className="activities-header">
          <h2>Company Activities</h2>
          <p>Explore our corporate events, CSR initiatives, and company highlights</p>
        </div>

        {/* Folder tabs */}
        {folders.length > 0 && (
          <div className="act-folder-tabs">
            <button className={`act-folder-tab${activeFolder==='all'?' active':''}`}
              onClick={() => setActiveFolder('all')}>
              📋 All
              <span className="act-folder-count">{allItems.length}</span>
            </button>
            {folders.map(f => {
              const count = allItems.filter(i=>i.folderId===f.id).length;
              return (
                <button key={f.id}
                  className={`act-folder-tab${activeFolder===f.id?' active':''}`}
                  onClick={() => setActiveFolder(f.id)}>
                  📁 {f.name}
                  <span className="act-folder-count">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Filters */}
        <div className="act-filter-bar">
          {(videoCount > 0 && imageCount > 0) && (
            <div className="act-filter-group">
              <span className="act-filter-label">Show</span>
              <div className="act-filter-pills">
                {[
                  { val:'all',   label:`All (${allItems.length})` },
                  { val:'video', label:`▶ Videos (${videoCount})` },
                  { val:'image', label:`🖼 Photos (${imageCount})` },
                ].map(t => (
                  <button key={t.val}
                    className={`act-filter-pill${activeMediaType===t.val?' active':''}`}
                    onClick={() => setActiveMediaType(t.val)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {years.length > 1 && (
            <div className="act-filter-group">
              <span className="act-filter-label">Year</span>
              <div className="act-filter-pills">
                <button className={`act-filter-pill${activeYear==='all'?' active':''}`}
                  onClick={() => setActiveYear('all')}>All</button>
                {years.map(y => (
                  <button key={y} className={`act-filter-pill${activeYear===y?' active':''}`}
                    onClick={() => setActiveYear(y)}>{y}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📂</div>
            <p style={{ fontSize:16 }}>No items found for the selected filters.</p>
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
                      <div style={{ display:'flex', gap:6, marginBottom:6, flexWrap:'wrap' }}>
                        <span className="video-tag" style={{ background: badge.bg }}>{badge.label}</span>
                        {item.folderId && folderName(item.folderId) && (
                          <span className="video-tag" style={{ background:'rgba(255,255,255,0.12)' }}>
                            📁 {folderName(item.folderId)}
                          </span>
                        )}
                      </div>
                      <h5>{item.title}</h5>
                      {item.date && (
                        <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:'4px 0 0' }}>
                          {formatDate(item.date)}
                        </p>
                      )}
                    </div>
                    <ActionIcon item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lightbox / Modal ── */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          style={{
            position:'fixed', inset:0, zIndex:3000,
            background:'rgba(0,0,0,0.93)',
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            padding:20,
          }}
        >
          <div onClick={e => e.stopPropagation()}
            style={{ width:'100%', maxWidth: activeItem.type==='image' ? 860 : 960 }}>

            {/* Lightbox header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ flex:1, marginRight:16 }}>
                <div style={{ color:'#fff', fontSize:17, fontWeight:700, marginBottom:4 }}>{activeItem.title}</div>
                {activeItem.date && (
                  <div style={{ color:'rgba(255,255,255,0.45)', fontSize:13 }}>{formatDate(activeItem.date)}</div>
                )}
                {activeItem.desc && (
                  <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginTop:5 }}>{activeItem.desc}</div>
                )}
              </div>
              <button onClick={() => setActiveItem(null)}
                style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff',
                  borderRadius:8, padding:'7px 18px', cursor:'pointer', fontSize:13,
                  fontWeight:600, flexShrink:0 }}>
                ✕ Close
              </button>
            </div>

            {/* YouTube */}
            {activeItem.type === 'youtube' && (
              <div style={{ position:'relative', paddingBottom:'56.25%', height:0, overflow:'hidden', borderRadius:12 }}>
                <iframe
                  src={`https://www.youtube.com/embed/${activeItem.youtubeId}?autoplay=1`}
                  title={activeItem.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}
                />
              </div>
            )}

            {/* Google Drive video — opens in new tab for reliable playback */}
            {activeItem.type === 'drive_video' && (
              <div style={{ borderRadius:12, overflow:'hidden', background:'#000', textAlign:'center' }}>
                <div style={{ position:'relative', paddingBottom:'56.25%', height:0 }}>
                  <iframe
                    src={`https://drive.google.com/file/d/${activeItem.driveFileId}/preview`}
                    title={activeItem.title}
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen
                    style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
                  />
                </div>
                <a
                  href={`https://drive.google.com/file/d/${activeItem.driveFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display:'inline-block', marginTop:10, marginBottom:12,
                    color:'rgba(255,255,255,0.5)', fontSize:12, textDecoration:'none' }}
                >
                  🔗 Open in Google Drive if video doesn't play
                </a>
              </div>
            )}

            {/* Local video (legacy) */}
            {activeItem.type === 'local_video' && (
              <video
                src={activeItem.videoSrc}
                controls
                autoPlay
                style={{ width:'100%', borderRadius:12, maxHeight:'72vh', background:'#000', display:'block' }}
              />
            )}

            {/* Image */}
            {activeItem.type === 'image' && (
              <img
                src={activeItem.src}
                alt={activeItem.title}
                style={{ width:'100%', borderRadius:12, maxHeight:'72vh', objectFit:'contain', display:'block' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
