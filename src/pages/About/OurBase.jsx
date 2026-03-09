import React, { useState } from "react";
import "../../styles/OurBase.css";
import factory1Img from "../../assets/images/Factory1.jpg";
import factory3Img from "../../assets/images/Factory3.jpg";
import japanHQImg from "../../assets/images/HeadOffice.jpg";
import yoriiImg from "../../assets/images/yorii1.jpg";
import ogoeImg from "../../assets/images/Fukushima.jpg";
import iideImg from "../../assets/images/Fukushima2.jpg";
import shanghai1Img from "../../assets/images/Shanghai.jpg";
import shanghai2Img from "../../assets/images/Shanghai2.jpg";

const bases = [
  {
    name: "OHTSUKA POLY-TECH PHILIPPINES, INC.",
    address: "Block 5 Lot 1 Binary St., LISPP1-PEZA, Bo. Diezmo, Cabuyao, Laguna 4025, Philippines",
    img: factory1Img,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7029.588069405725!2d121.09563!3d14.23685!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd627001fdbdf9%3A0xa6125d771a9017ff!2sOhtsuka%20Poly-tech%20Philippines%20Inc.!5e1!3m2!1sen!2sph!4v1770792411203!5m2!1sen!2sph"

  },
  {
    name: "OHTSUKA POLY-TECH (PHILIPPINES) INC. FACTORY 3",
    address: "Block 10 Lot 1B and 2A Mega Drive St., LISPP-4 PEZA, Brgy. Bulihan, Malvar, Batangas 4233, Philippines",
    img: factory3Img,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7036.054679899685!2d121.146957!3d14.027609!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd6fcbda11fdad%3A0x9e9257977a043bc7!2sOhtsuka%20Poly-Tech%20(Philippines)%20Inc.%20(Malvar%20Factory%20-%20F3)!5e1!3m2!1sen!2sph!4v1770796188201!5m2!1sen!2sph"
  },
  {
    name: "JAPAN HEAD OFFICE",
    address: "4962, Ooaza Haneo, Namegawa-machi, Hiki-Gun, Saitama Japan 355-0811" ,
    img: japanHQImg,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d46900.171157463206!2d139.359019!3d36.063575!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601ed57b986b8a25%3A0x64d3b57b6f18caae!2z5pel5pys44CB44CSMzU1LTA4MTEg5Z-8546J55yM5q-U5LyB6YOh5ruR5bed55S657695bC-77yU77yZ77yW77yS!5e1!3m2!1sja!2sph!4v1770796474645!5m2!1sja!2sph"
  },
  {
    name: "YORII CENTER",
    address: "556 Oaza Kozono, Osato District, Yorii, Saitama, Japan",
    img: yoriiImg,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5858.641584914677!2d139.222006!3d36.115611!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601ed072b50553bb%3A0xa5c4204237a92412!2z5aSn5aGa44Od44Oq44OG44OD44Kv77yI5qCq77yJIOWvhOWxheeJqea1geOCu-ODs-OCv-ODvA!5e1!3m2!1sfil!2sph!4v1770796572826!5m2!1sfil!2sph"
  },
  {
    name: "FUKUSHIMA OGOE PLANT",
    address: "137−1 Aza Sakai Makino, Ogoe−machi, Tamura−shi, Fukushima Japan 963−4114",
    img: ogoeImg,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d46111.39139228797!2d140.611023!3d37.366557!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60205e8e89e8436f%3A0x2c62c4c39d02b2dc!2z5pel5pys44CB44CSOTYzLTQxMTQg56aP5bO255yM55Sw5p2R5biC5aSn6LaK55S654mn6YeO5aC677yR77yT77yX4oiS77yR!5e1!3m2!1sja!2sus!4v1770796638948!5m2!1sja!2sus"
  },
  {
    name: "FUKUSHIMA ONO PLANT",
    address: "48 Nihongi Ooaza Iide, Ono−machi, Tamura−gun, Fukushima Japan 963−3521",
    img: iideImg,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d46151.274310819244!2d140.619229!3d37.301613!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x602059a1ad1c097b%3A0xdad1fd30c39735cd!2z5pel5pys44CB44CSOTYzLTM1MjEg56aP5bO255yM55Sw5p2R6YOh5bCP6YeO55S66aOv6LGK5LqM5pys5pyo77yU77yY!5e1!3m2!1sja!2sph!4v1770796706987!5m2!1sja!2sph"
  },
  {
    name: "SHANGHAI RISHANG AUTOMOBILE RUBBERT PRODUCTS CO., LTD",
    address: "No.123 Chenchun Road, Chunshen Village, Xinqiao Town, Songjiang District, Shanghai, China",
    img: shanghai1Img,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6211.160017870774!2d121.36332199999998!3d31.081152!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b262066535ea85%3A0xa02a728d805ed29b!2z5LiK5rW35pel5LiK6LuK55So5qmh6Iag5Lu25pyJ6ZmQ5YWs5Y-4!5e1!3m2!1sja!2sph!4v1770796808789!5m2!1sja!2sph"
  },
  {
    name: "SHANGHAI O.P.T RUBBER & PLASTIC CO., LTD.",
    address: "No. 6 Chenchun Road, Chunshen Village, Xinqiao Town, Songjiang District, Shanghai, China",
    img: shanghai2Img,
    map: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d99378.33549648954!2d121.36357100000001!3d31.081367!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b26206773bc93f%3A0xf985a3c3a8dd93f8!2z5pil55Sz5p2R!5e1!3m2!1sja!2sph!4v1770796880402!5m2!1sja!2sph"
  }
];


const OurBase = () => {
  const [activeMap, setActiveMap] = useState(null);

  return (
    <div className="our-base-section company-section">
      <h2>Our Base</h2>
      <div className="row">
        {bases.map((base, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-4">
            <div className="base-card shadow-lg h-100">
              <img src={base.img} alt={base.name} className="base-img" />
              <div className="base-info p-3">
                <h5>{base.name}</h5>
                <p>{base.address}</p>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setActiveMap(base.map)}
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAP MODAL */}
      {activeMap && (
        <div className="map-modal" onClick={() => setActiveMap(null)}>
          <div className="map-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveMap(null)}>
              &times;
            </button>
            <iframe
              src={activeMap}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurBase;
