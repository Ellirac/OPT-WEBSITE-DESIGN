import React, { useState } from "react";
import owner1 from "../../assets/images/Owner.png"; // MR. KO OTSUKA
import owner2 from "../../assets/images/Chairman.png"; // MR. KEI OTSUKA
import "../../styles/company.css";

const OwnerMessage = () => {
  const owners = [
    {
      img: owner1,
      name: "MR. KO OTSUKA",
      title: "Owner"
    },
    {
      img: owner2,
      name: "MR. KEI OTSUKA",
      title: "Chairman & President"
    }
  ];

  const messageJP = `1948年の創業以来、関係者皆さま方のご支援、ご協力に心より感謝を申し上げます。
弊社は、より安定した環境と強固な競争力を確立する為に邁進して参ります。
グローバル化については、フィリピン工場および中国工場を増強し、より一層の強化を図ります。
海外のお客様のニーズにも積極的に対応して参ります。また多様化する市場においても、主力の自動車、モーターサイクルに加え、
建設・弱電メーカーへの拡販にも取り組んで参ります。そして、ISO、IATFの国際規格認証を取得することで、
環境に配慮しながら製品の品質保証体制を構築しています。

「新たな時代を切り開いていく」これが私たちの目標です。

OPTグループ全社一丸となってお客様のご要望やご期待にお応え出来るよう、
それぞれの責務を果たしていく所存で御座います。`;

  const messageEN = `I would like to express my sincere appreciation for the support and cooperation of the people concerned since the establishment of the Japan headquarters in 1948.
In order to establish a more stable environment and strong competitiveness, we will promote a new day ahead.
For globalization, we will further strengthen by reinforcing the Philippines and China factories. We will actively respond to overseas customers’ needs as well.
Also, even in diversifying markets, in addition to our main automobile and motorcycle products, we will also do our best to deal with construction and light electrical appliance manufacturers.
And by acquiring ISO and TS international standards certification, we are stiffening the quality assurance system of products while considering the environment.
"Open up a new era" This is our target. Based from this, we, the OPT Group companies are determined to fulfil our respective responsibilities so that they can respond to customer requests and expectations as one.
I sincerely wish to earn your continuous support.`;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeOwner, setActiveOwner] = useState(0);

  const openLightbox = (index) => {
    setActiveOwner(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevOwner = (e) => {
    e.stopPropagation();
    setActiveOwner((prev) => (prev === 0 ? owners.length - 1 : prev - 1));
  };

  const nextOwner = (e) => {
    e.stopPropagation();
    setActiveOwner((prev) => (prev === owners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="owner-message-section company-section">
      <h2>Message from the Owner & Chairman</h2>

      {/* OWNER CARDS */}
      <div className="row owner-cards mb-4">
        {owners.map((owner, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card shadow-sm h-100 owner-card d-flex align-items-center p-3">
              <img
                src={owner.img}
                alt={owner.name}
                className="owner-img clickable-img me-3"
                onClick={() => openLightbox(index)}
              />
              <div>
                <h5 className="mb-1">{owner.name}</h5>
                <p className="mb-0 text-muted">{owner.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MESSAGE BOX */}
      <div className="owner-message p-4 rounded shadow-lg bg-gradient">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h6 className="fw-bold text-danger mb-2">日本語</h6>
            <p style={{ whiteSpace: "pre-line" }}>{messageJP}</p>
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold text-danger mb-2">English</h6>
            <p style={{ whiteSpace: "pre-line" }}>{messageEN}</p>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <button className="lightbox-nav left" onClick={prevOwner}>&lt;</button>
            <button className="lightbox-nav right" onClick={nextOwner}>&gt;</button>
            <img src={owners[activeOwner].img} alt={owners[activeOwner].name} />
            <div className="lightbox-caption mt-2">
              <h5>{owners[activeOwner].name}</h5>
              <p className="text-muted">{owners[activeOwner].title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerMessage;
