import React, { useEffect } from 'react';

/**
 * Modal
 * Props:
 *   title   – string
 *   onClose – fn
 *   children
 *   wide    – bool (wider modal, e.g. for forms with two columns)
 */
export default function Modal({ title, onClose, children, wide = false }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="cms-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`cms-modal${wide ? ' cms-modal--wide' : ''}`}>
        <div className="cms-modal-header">
          <h3 className="cms-modal-title">{title}</h3>
          <button className="cms-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="cms-modal-body">{children}</div>
      </div>
    </div>
  );
}

/**
 * ModalActions – helper wrapper for bottom action buttons
 */
export function ModalActions({ children }) {
  return <div className="cms-modal-actions">{children}</div>;
}
