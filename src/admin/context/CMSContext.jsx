import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';

import { db } from '../firebase';
import {
  doc, setDoc, onSnapshot
} from 'firebase/firestore';

/**
 * CMS State shape — mirrors the actual hardcoded data in each site component.
 *
 * home.certifications  → replaces the hardcoded `certs` array in Home.jsx
 * home.partners        → replaces the hardcoded `allPartners` array in Home.jsx
 * about.factories      → replaces hardcoded factory data in CompanyProfile.jsx
 * about.companyInfo    → replaces hardcoded company info fields in CompanyProfile.jsx
 * about.history        → replaces hardcoded `history` array in CompanyHistory.jsx
 * about.organization   → replaces hardcoded `organization` array in OurTeam.jsx
 * about.management     → replaces hardcoded `management` array in OurTeam.jsx
 * about.bases          → replaces hardcoded `bases` array in OurBase.jsx
 * activities.posts     → replaces hardcoded `activities` array in Activities.jsx (YouTube-based)
 * careers.jobs         → replaces hardcoded `jobList` + `jobRequirement` in Careers.jsx
 * products.parts       → replaces hardcoded `parts` + `pinPositions` in AutomobileProduct.jsx
 */
const initialState = {
  home: {
    certifications: [
      { id: 'c1', code: 'ISO 9001',   label: 'Quality Management',     img: null, issuedBy: 'Bureau Veritas', validUntil: '' },
      { id: 'c2', code: 'ISO 14001',  label: 'Environmental Management', img: null, issuedBy: 'Bureau Veritas', validUntil: '' },
      { id: 'c3', code: 'IATF 16949', label: 'Automotive Quality',     img: null, issuedBy: 'Bureau Veritas', validUntil: '' },
      { id: 'c4', code: '5S',         label: 'Workplace Excellence',   img: null, issuedBy: '',              validUntil: '' },
    ],
    partners: [
      { id: 'p1',  name: 'BIGMATE PHILIPPINES INC.' },
      { id: 'p2',  name: 'F.TECH PHILIPPINES MFG., INC.' },
      { id: 'p3',  name: 'FCC (PHILIPPINES) CORP.' },
      { id: 'p4',  name: 'FURUKAWA ELECTRIC AUTOPARTS PHILS.' },
      { id: 'p5',  name: 'HARADA AUTOMOTIVE ANTENNA PHILS.' },
      { id: 'p6',  name: 'HIBLOW PHILIPPINES INC.' },
      { id: 'p7',  name: 'HKT PHILIPPINES INC.' },
      { id: 'p8',  name: 'HONDA CARS PHILIPPINES INC.' },
      { id: 'p9',  name: 'HONDA PARTS MFG. CORP.' },
      { id: 'p10', name: 'HONDA PHILIPPINES INC.' },
      { id: 'p11', name: 'HONDA TRADING PHILIPPINES ECOZONE' },
      { id: 'p12', name: 'KYUSHU F.TECH INC.' },
      { id: 'p13', name: 'LAGUNA AUTO-PARTS MFG. CORP.' },
      { id: 'p14', name: 'MEC ELECTRONICS PHILS. CORP.' },
      { id: 'p15', name: 'MITSUBA PHILIPPINES CORPORATION' },
      { id: 'p16', name: 'MUBEA DO BRASIL' },
      { id: 'p17', name: 'MUBEA INC.' },
      { id: 'p18', name: 'OHTSUKA POLY-TECH CO., LTD.' },
      { id: 'p19', name: 'PT MINEBEA ACCESSSOLUTIONS INDONESIA' },
      { id: 'p20', name: 'PT. MAHLE INDONESIA' },
      { id: 'p21', name: 'RYONAN ELECTRIC PHILIPPINES CORP.' },
      { id: 'p22', name: 'SANDEN INTERNATIONAL PHILIPPINES' },
      { id: 'p23', name: 'SHANGHAI O.P.T RUBBER & PLASTIC' },
      { id: 'p24', name: 'SHANGHAI RI SHANG AUTO RUBBER CO.' },
      { id: 'p25', name: 'SIIX EMS PHILIPPINES, INC.' },
      { id: 'p26', name: 'SUNCHIRIN INDUSTRIES (MALAYSIA)' },
      { id: 'p27', name: 'TAIYO CORPORATION' },
      { id: 'p28', name: 'TOYOTA AISIN PHILIPPINES, INC.' },
      { id: 'p29', name: 'TOYOTA MOTORS PHILIPPINES CORP.' },
      { id: 'p30', name: 'TOYU INDUSTRIES (THAILAND) CO., LTD.' },
      { id: 'p31', name: 'TRITON INDUSTRIAL PLASTIC MFG. CORP.' },
      { id: 'p32', name: 'WISTAR CORPORATION' },
    ],
  },

  about: {
    factories: [
      {
        id: 'f1',
        name: 'Factory 1',
        lotArea: '18,959 m²',
        buildingArea: '8,578 m²',
        address: 'Block 5 Lot 1 Binary St., LISPP-1 SEPZ, Bo. Diezmo, Cabuyao, Laguna 4025',
        built: '',
        img: null,
      },
      {
        id: 'f2',
        name: 'Factory 2',
        lotArea: '10,944 m²',
        buildingArea: '7,367 m²',
        address: 'Block 3 Lot 2 Binary St., LISPP-1 SEPZ, Bo. Diezmo, Cabuyao, Laguna 4025',
        built: 'Dec 5, 2015',
        img: null,
      },
      {
        id: 'f3',
        name: 'Factory 3',
        lotArea: '16,938 m²',
        buildingArea: '14,676 m²',
        address: 'Block 10 Lot 1B and 2A Mega Drive St., LISPP-4 PEZA, Brgy. Bulihan, Malvar, Batangas',
        built: 'Nov. 2023',
        img: null,
      },
    ],

    companyInfo: {
      company:      'Ohtsuka Poly-Tech Philippines, Inc.',
      established:  'September 11, 1992',
      operations:   'May 03, 1993',
      businessType: 'Manufacture Rubber & Plastic Parts for Automobiles, Electrical & Household appliances',
      telephone:    '(049) 543-0622/23/25 loc. 809 & 810',
      smart:        '0939-939-3611 / 0998-974-0478',
      globe:        '0917-718-7284',
      manilaLine:   '(02) 475-1675',
      products:     'Rubber & Plastic parts for Automobiles, Electrical & Household appliances',
      workforce:    '748 (as of December 2024)',
    },

    history: [
      { id: 'h1', year: 1948, event: 'Began as a rubber factory in Ueno Taito-ku Tokyo, started supply to Honda Motors.' },
      { id: 'h2', year: 1974, event: 'Completed FUKUSHIMA ONO FACTORY.' },
      { id: 'h3', year: 1985, event: 'FUKUSHIMA OGOE FACTORY was established.' },
      { id: 'h4', year: 1992, event: 'OHTSUKA POLY-TECH (PHILIPPINES) INC. was established.' },
      { id: 'h5', year: 1995, event: 'SHANGHAI O.P.T RUBBER & PLASTIC Co., LTD. was established.' },
      { id: 'h6', year: 2005, event: 'OPT Yorii Center was established.' },
      { id: 'h7', year: 2015, event: 'OHTSUKA POLY-TECH (PHILIPPINES) INC. FACTORY 2 was established.' },
      { id: 'h8', year: 2018, event: 'Increased OHTSUKA POLY-TECH PHILIPPINES capital to PHP 400,000,000.' },
      { id: 'h9', year: 2023, event: 'OHTSUKA POLY-TECH (PHILIPPINES) INC. FACTORY 3 was established.' },
    ],

    // Organization section of OurTeam (people with photos)
    organization: [
      { id: 'o1', name: 'MR. KO OTSUKA',        role: 'OWNER',                img: null },
      { id: 'o2', name: 'MR. KEI OTSUKA',        role: 'CHAIRMAN & PRESIDENT', img: null },
      { id: 'o3', name: 'MS. MARIETTA CANAYON',  role: 'OPT-P DIRECTOR',       img: null },
      { id: 'o4', name: 'MR. KIKUO NAKAYAMA',    role: 'VICE-PRESIDENT',        img: null },
    ],

    // Management section of OurTeam (departments + sub-teams, no photos)
    management: [
      { id: 'm1', department: 'ADMINISTRATION', teams: ['Human Resources', 'Accounting', 'IT'] },
      { id: 'm2', department: 'PLANNING',       teams: ['Planning', 'Purchasing'] },
      { id: 'm3', department: 'SALES',          teams: ['Sales', 'DCC'] },
      { id: 'm4', department: 'PRODUCTION',     teams: ['Production 1', 'Production 2', 'Finishing, Inspection & Packing'] },
      { id: 'm5', department: 'TECHNICAL',      teams: ['Technical', 'Maintenance'] },
    ],

    bases: [
      {
        id: 'b1',
        name: 'OHTSUKA POLY-TECH PHILIPPINES, INC.',
        address: 'Block 5 Lot 1 Binary St., LISPP1-PEZA, Bo. Diezmo, Cabuyao, Laguna 4025, Philippines',
        website: '', websiteName: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7029.588069405725!2d121.09563!3d14.23685!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd627001fdbdf9%3A0xa6125d771a9017ff!2sOhtsuka%20Poly-tech%20Philippines%20Inc.!5e1!3m2!1sen!2sph!4v1770792411203!5m2!1sen!2sph',
        img: null,
      },
      {
        id: 'b2',
        name: 'OHTSUKA POLY-TECH (PHILIPPINES) INC. FACTORY 3',
        address: 'Block 10 Lot 1B and 2A Mega Drive St., LISPP-4 PEZA, Brgy. Bulihan, Malvar, Batangas 4233, Philippines',
        website: '', websiteName: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7036.054679899685!2d121.146957!3d14.027609!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd6fcbda11fdad%3A0x9e9257977a043bc7!2sOhtsuka%20Poly-Tech%20(Philippines)%20Inc.%20(Malvar%20Factory%20-%20F3)!5e1!3m2!1sen!2sph!4v1770796188201!5m2!1sen!2sph',
        img: null,
      },
      {
        id: 'b3',
        name: 'JAPAN HEAD OFFICE',
        address: '4962, Ooaza Haneo, Namegawa-machi, Hiki-Gun, Saitama Japan 355-0811',
        website: 'https://www.poly-tech.co.jp/', websiteName: '大塚ポリテック株式会社',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d46900.171157463206!2d139.359019!3d36.063575!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601ed57b986b8a25%3A0x64d3b57b6f18caae!2z5pel5pys44CB44CSMzU1LTA4MTEg5Z-8546J55yM5q-U5LyB6YOh5ruR5bed55S657695bC-77yU77yZ77yS!5e1!3m2!1sja!2sph!4v1770796474645!5m2!1sja!2sph',
        img: null,
      },
      {
        id: 'b4',
        name: 'YORII CENTER',
        address: '556 Oaza Kozono, Osato District, Yorii, Saitama, Japan',
        website: '', websiteName: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5858.641584914677!2d139.222006!3d36.115611!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601ed072b50553bb%3A0xa5c4204237a92412!2z5aSn5aGa44Od44Oq44OG44OD44Kv77yI5qCq77yJIOWvhOWxheeJqea1geOCu-ODs-OCv-ODvA!5e1!3m2!1sfil!2sph!4v1770796572826!5m2!1sfil!2sph',
        img: null,
      },
      {
        id: 'b5',
        name: 'FUKUSHIMA OGOE PLANT',
        address: '137-1 Aza Sakai Makino, Ogoe-machi, Tamura-shi, Fukushima Japan 963-4114',
        website: '', websiteName: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d46111.39139228797!2d140.611023!3d37.366557!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60205e8e89e8436f%3A0x2c62c4c39d02b2dc!2z5pel5pys44CB44CSOTYzLTQxMTQg56aP5bO255yM55Sw5p2R5biC5aSn6LaK55S654mn6YeO5aC677yR77yT77yX4oiS77yR!5e1!3m2!1sja!2sus!4v1770796638948!5m2!1sja!2sus',
        img: null,
      },
      {
        id: 'b6',
        name: 'FUKUSHIMA ONO PLANT',
        address: '48 Nihongi Ooaza Iide, Ono-machi, Tamura-gun, Fukushima Japan 963-3521',
        website: '', websiteName: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d46151.274310819244!2d140.619229!3d37.301613!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x602059a1ad1c097b%3A0xdad1fd30c39735cd!2z5pel5pys44CB44CSOTYzLTM1MjEg56aP5bO255yM55Sw5p2R6YOh5bCP6YeO55S66aOv6LGK5LqM5pys5pyo77yU77yY!5e1!3m2!1sja!2sph!4v1770796706987!5m2!1sja!2sph',
        img: null,
      },
      {
        id: 'b7',
        name: 'SHANGHAI RISHANG AUTOMOBILE RUBBERT PRODUCTS CO., LTD',
        address: 'No.123 Chenchun Road, Chunshen Village, Xinqiao Town, Songjiang District, Shanghai, China',
        website: '', websiteName: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6211.160017870774!2d121.36332199999998!3d31.081152!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b262066535ea85%3A0xa02a728d805ed29b!2z5LiK5rW35pel5LiK6LuK55So5qmh6Iag5Lu25pyJ6ZmQ5YWs5Y-4!5e1!3m2!1sja!2sph!4v1770796808789!5m2!1sja!2sph',
        img: null,
      },
      {
        id: 'b8',
        name: 'SHANGHAI O.P.T RUBBER & PLASTIC CO., LTD.',
        address: 'No. 6 Chenchun Road, Chunshen Village, Xinqiao Town, Songjiang District, Shanghai, China',
        website: '', websiteName: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d99378.33549648954!2d121.36357100000001!3d31.081367!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b26206773bc93f%3A0xf985a3c3a8dd93f8!2z5pil55Sz5p2R!5e1!3m2!1sja!2sph!4v1770796880402!5m2!1sja!2sph',
        img: null,
      },
    ],
  },

  // Activities — YouTube-based (youtubeId + title + category)
  activities: {
    folders: [
      { id:'af1', name:'Corporate Events',   date:'2024-01-01' },
      { id:'af2', name:'CSR Activities',     date:'2024-01-01' },
      { id:'af3', name:'Company Milestones', date:'2024-01-01' },
    ],
    images: [],
    posts: [
      { id: 'a1', title: 'APV Expo Philippines 2025',                    category: 'Event',               youtubeId: 'QNpJaWDy-0Y' },
      { id: 'a2', title: 'Christmas Spirit Program 2024',                category: 'CSR',                 youtubeId: '5GC7A5Wedm8' },
      { id: 'a3', title: 'Inauguration & 30th Anniversary Celebration',  category: 'Corporate Milestone', youtubeId: 'vNhD8no4sj4' },
      { id: 'a4', title: 'Annual Company Sportfest 2023',                category: 'Employee Engagement', youtubeId: 'cELpR9JUUww' },
      { id: 'a5', title: 'Community Donation Drive 2023',                category: 'CSR',                 youtubeId: 'XgbeoEwirXM' },
      { id: 'a6', title: 'COVID-19 Prevention & Safety Program',         category: 'Health & Safety',     youtubeId: 'lSA6sG039K4' },
    ],
  },

  // Careers — full job objects matching existing Careers.jsx structure
  careers: {
    jobs: [
      {
        id: 'j1',
        title: 'Company Driver',
        date: '01/06/2025',
        jobType: 'Full-time',
        qualifications: [
          'Male',
          '23 to 40 Years old',
          "Must have valid Driver's License up to Restriction Code C (Large trucks)",
          'Familiar with the area of Metro Manila, Laguna and nearby provinces route',
          'Preferably with own motorcycle vehicle',
        ],
        experience: "Preferably with experience as a Company Driver",
        requirements: [],
        benefits: [
          'Meal allowance upon regularization',
          'Rice allowance upon regularization',
          'Transportation allowance',
          'HMO upon regularization',
          'Retirement Benefit',
        ],
      },
      {
        id: 'j2',
        title: 'Mechanical Engineer',
        date: '01/28/2025',
        jobType: 'Full-time',
        qualifications: [
          'Candidate must possess at least Bachelor / College Degree of Mechanical Engineering',
          'With PRC License',
          'Newly board passers are welcome to apply',
          'Preferably with AutoCAD certification',
          'Knowledge in Microsoft Office applications',
        ],
        experience: 'Preferably with experience as Mechanical Engineer',
        requirements: [],
        benefits: [
          'Competitive Salary',
          'Meal allowance upon regularization',
          'Rice allowance upon regularization',
          'Transportation allowance (if with owned service)',
          'Free shuttle',
          'HMO upon regularization',
          'Retirement Benefit',
        ],
      },
      {
        id: 'j3',
        title: 'Molding Operator / Production Operator',
        date: '01/06/2025',
        jobType: 'Full-Time',
        qualifications: [
          'Male',
          '23 to 35 Years Old',
          'At least Senior High school graduate or any vocational course',
          'With familiar in Manufacturing Process',
          'Willing to be assigned in Cabuyao, Laguna or Malvar, Batangas',
        ],
        experience: 'At least One (1) year experience in related as Mold Operator.',
        requirements: [],
        benefits: [
          'Minimum wage rate',
          'With Monthly Productivity Incentive',
          'Meal allowance upon regularization',
          'Rice allowance upon regularization',
          'Free shuttle',
          'HMO upon regularization',
          'Retirement Benefits',
        ],
      },
      {
        id: 'j4',
        title: 'Electrical Engineer',
        date: '01/28/2025',
        jobType: 'Full-Time',
        qualifications: [
          'Bachelor degree (Graduate of Electrical Engineer)',
          'With PRC license',
          'Newly board passers are welcome to apply',
          'Preferably with AutoCAD certification',
        ],
        experience: '',
        requirements: [
          'Experience in project development, design installation and startup',
          'Experience with design, installation, and maintenance of industrial power, lighting, and control systems',
          'Strong planning, organization, analytical, and troubleshooting skills',
        ],
        benefits: [
          'Competitive Salary',
          'Meal allowance upon regularization',
          'Rice allowance upon regularization',
          'Transportation allowance (if with owned service)',
          'Free shuttle',
          'HMO upon regularization',
          'Retirement Benefit',
        ],
      },
    ],
  },

  // Products — categories and parts synced with public product pages
  products: {
  autoCategories: [
    { id:'anti',   label:'Anti-Vibration Rubber', color:'#e74c3c', desc:'Vulcanized rubber products used for the purpose of vibration transmission prevention and interference reduction in automobile components.' },
    { id:'grommet',label:'Grommets',              color:'#3498db', desc:'Rubber grommets and insulating parts that protect wiring harnesses, cables, and hoses from abrasion through metal panels and brackets.' },
    { id:'seal',   label:'Packing Seals',         color:'#9b59b6', desc:'Sealing products resistant to oils, fuel, water, air, and dust — preventing leakage across mating surfaces and joints.' },
    { id:'stop',   label:'Stopper',               color:'#f39c12', desc:'Rubber stoppers and bump stops that absorb impact and limit range of motion in suspension and body components.' },
    { id:'resin',  label:'Resin',                 color:'#1abc9c', desc:'High-precision resin and plastic parts used in automobile assemblies requiring dimensional stability and chemical resistance.' },
  ],
  parts: [
    { id:'p1',  name:'Exhaust Mount',          categoryId:'anti',    pinTop:39, pinLeft:80, img:'automobile/Vehicle Products/1. Exhaust Mount.png' },
    { id:'p2',  name:'Spring Lower Mount',     categoryId:'anti',    pinTop:35, pinLeft:77, img:'automobile/Vehicle Products/2. Spring Lower Mount.png' },
    { id:'p3',  name:'Radiator Mount',         categoryId:'anti',    pinTop:78, pinLeft:22, img:'automobile/Vehicle Products/3. Radiator Mount.png' },
    { id:'p4',  name:'Electric servo mount',   categoryId:'anti',    pinTop:48, pinLeft:25, img:'automobile/Vehicle Products/4. Electric Serrvo Mount.png' },
    { id:'p5',  name:'Fuel Tank Cushion',      categoryId:'anti',    pinTop:60, pinLeft:63, img:'automobile/Vehicle Products/5. Fuel Tank Cushion.png' },
    { id:'p6',  name:'Stabilize bush',         categoryId:'anti',    pinTop:71, pinLeft:42, img:'automobile/Vehicle Products/6. Stabilizer Bushings.png' },
    { id:'p7',  name:'Metal Bonding',          categoryId:'anti',    pinTop:57, pinLeft:41, img:'automobile/Vehicle Products//7. Metal Adhesion.png' },
    { id:'p8',  name:'Hole Grommet',           categoryId:'grommet', pinTop:13, pinLeft:58, img:'automobile/Vehicle Products/8. Hole Grommets.png' },
    { id:'p9',  name:'Steering Grommets',      categoryId:'grommet', pinTop:52, pinLeft:47, img:'automobile/Vehicle Products/9. Steering Grommet.png' },
    { id:'p10', name:'Head cover packing',     categoryId:'seal',    pinTop:49, pinLeft:33, img:'automobile/Vehicle Products/10. Head Cover Gasket.png' },
    { id:'p11', name:'Fuel Packing',           categoryId:'seal',    pinTop:64, pinLeft:60, img:'automobile/Vehicle Products/11. Fuel Packing.png' },
    { id:'p12', name:'Water Pump Packing',     categoryId:'seal',    pinTop:44, pinLeft:30, img:'automobile/Vehicle Products/12. Water Pump Gasket.png' },
    { id:'p13', name:'Thermomount',            categoryId:'seal',    pinTop:57, pinLeft:34, img:'automobile/Vehicle Products/13. Thermo Mount.png' },
    { id:'p14', name:'Oil filter packing',     categoryId:'seal',    pinTop:59, pinLeft:27, img:'automobile/Vehicle Products/14. Oil Filter Gasket.png' },
    { id:'p15', name:'Filler Cap',             categoryId:'seal',    pinTop:51, pinLeft:39, img:'automobile/Vehicle Products/15. Filter Cap.png' },
    { id:'p16', name:'In-mani Packing',        categoryId:'seal',    pinTop:53, pinLeft:30, img:'automobile/Vehicle Products/16. Intake Manifold Gasket.png' },
    { id:'p17', name:'Tailgate Stopper',       categoryId:'stop',    pinTop:24, pinLeft:79, img:'automobile/Vehicle Products/17. Tailgate Stopper.png' },
    { id:'p18', name:'Door Stopper',           categoryId:'stop',    pinTop:50, pinLeft:63, img:'automobile/Vehicle Products/18. Door Stopper.png' },
    { id:'p19', name:'Trunk Stopper',          categoryId:'stop',    pinTop:32, pinLeft:82, img:'automobile/Vehicle Products/19. Trunk Stopper.png' },
    { id:'p20', name:'Oil Level Gauge',        categoryId:'resin',   pinTop:54, pinLeft:23, img:'automobile/Vehicle Products/20. Oil Level Gauge.png' },
    { id:'p21', name:'Ashtray',                categoryId:'resin',   pinTop:39, pinLeft:40, img:'automobile/Vehicle Products/21. Ashtray.png' },
    { id:'p22', name:'Boots',                  categoryId:'resin',   pinTop:42, pinLeft:72, img:'automobile/Vehicle Products/22. Boots.png' },
  ],
  motorCategories: [
    { id:'seal',  label:'Packing Seals', color:'#3498db', desc:'Rubber sealing components that prevent leakage of oil, fuel, coolant, and other fluids across motorcycle engine and body joints.' },
    { id:'frame', label:'Frame Parts',   color:'#c0392b', desc:'Rubber and composite parts mounted to the motorcycle frame — including mounts, dampers, grommets, covers, and body-protection components.' },
  ],
  motorParts: [
    { id:'m1',  name:'Head Cover Gasket',                             categoryId:'seal',  pinTop:42, pinLeft:44, img:null },
    { id:'m2',  name:'Insulator Carb',                                categoryId:'seal',  pinTop:52, pinLeft:37, img:null },
    { id:'m3',  name:'Cylinder Head Gasket',                          categoryId:'seal',  pinTop:48, pinLeft:50, img:null },
    { id:'m4',  name:'Oil Drain Gasket',                              categoryId:'seal',  pinTop:65, pinLeft:46, img:null },
    { id:'m5',  name:'Exhaust Pipe Gasket',                           categoryId:'seal',  pinTop:60, pinLeft:58, img:null },
    { id:'m6',  name:'Fuel Tank Seal',                                categoryId:'seal',  pinTop:22, pinLeft:50, img:null },
    { id:'m7',  name:'Coolant Hose Seal',                             categoryId:'seal',  pinTop:36, pinLeft:28, img:null },
    { id:'m8',  name:'Plug, Rubber Stand & Band Tool',                categoryId:'frame', pinTop:68, pinLeft:50, img:null },
    { id:'m9',  name:'Rubber Radiator Mount & Damper Connector',      categoryId:'frame', pinTop:38, pinLeft:26, img:null },
    { id:'m10', name:'Damper, Rubber Side Cover & Damper Connector',  categoryId:'frame', pinTop:50, pinLeft:62, img:null },
    { id:'m11', name:'Rubber Radiator Mount, Band Tool & Dust Cover', categoryId:'frame', pinTop:30, pinLeft:30, img:null },
    { id:'m12', name:'Rubber Tail Light',                             categoryId:'frame', pinTop:28, pinLeft:80, img:null },
    { id:'m13', name:'Frame Grommet Set',                             categoryId:'frame', pinTop:44, pinLeft:72, img:null },
    { id:'m14', name:'Handlebar Grip & Damper',                       categoryId:'frame', pinTop:16, pinLeft:16, img:null },
    { id:'m15', name:'Footpeg Rubber & Bracket',                      categoryId:'frame', pinTop:72, pinLeft:34, img:null },
  ],
},

};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cmsReducer(state, { type, payload }) {
  const up = (section, key, fn) => ({
    ...state,
    [section]: { ...state[section], [key]: fn(state[section][key]) },
  });

  switch (type) {
    // HOME — CERTIFICATIONS
    case 'HOME_ADD_CERT':    return up('home', 'certifications', list => [...list, payload]);
    case 'HOME_UPDATE_CERT': return up('home', 'certifications', list => list.map(x => x.id === payload.id ? payload : x));
    case 'HOME_DEL_CERT':    return up('home', 'certifications', list => list.filter(x => x.id !== payload));
    case 'HOME_REORDER_CERTS': return up('home', 'certifications', () => payload);

    // HOME — PARTNERS
    case 'HOME_ADD_PARTNER':    return up('home', 'partners', list => [...list, payload]);
    case 'HOME_UPDATE_PARTNER': return up('home', 'partners', list => list.map(x => x.id === payload.id ? payload : x));
    case 'HOME_DEL_PARTNER':    return up('home', 'partners', list => list.filter(x => x.id !== payload));

    // ABOUT — FACTORIES
    case 'ABOUT_ADD_FACTORY':    return up('about', 'factories', list => [...list, payload]);
    case 'ABOUT_UPDATE_FACTORY': return up('about', 'factories', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ABOUT_DEL_FACTORY':    return up('about', 'factories', list => list.filter(x => x.id !== payload));

    // ABOUT — COMPANY INFO
    case 'ABOUT_UPDATE_INFO': return up('about', 'companyInfo', () => payload);

    // ABOUT — HISTORY
    case 'ABOUT_ADD_HISTORY':    return up('about', 'history', list => [...list, payload]);
    case 'ABOUT_UPDATE_HISTORY': return up('about', 'history', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ABOUT_DEL_HISTORY':    return up('about', 'history', list => list.filter(x => x.id !== payload));

    // ABOUT — ORGANIZATION
    case 'ABOUT_ADD_ORG':    return up('about', 'organization', list => [...list, payload]);
    case 'ABOUT_UPDATE_ORG': return up('about', 'organization', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ABOUT_DEL_ORG':    return up('about', 'organization', list => list.filter(x => x.id !== payload));

    // ABOUT — MANAGEMENT
    case 'ABOUT_ADD_MGMT':    return up('about', 'management', list => [...list, payload]);
    case 'ABOUT_UPDATE_MGMT': return up('about', 'management', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ABOUT_DEL_MGMT':    return up('about', 'management', list => list.filter(x => x.id !== payload));

    // ABOUT — BASES
    case 'ABOUT_ADD_BASE':    return up('about', 'bases', list => [...list, payload]);
    case 'ABOUT_UPDATE_BASE': return up('about', 'bases', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ABOUT_DEL_BASE':    return up('about', 'bases', list => list.filter(x => x.id !== payload));

    // ACTIVITIES — FOLDERS
    case 'ACT_FOLDER_ADD':    return up('activities','folders', list=>[...list,payload]);
    case 'ACT_FOLDER_UPDATE': return up('activities','folders', list=>list.map(x=>x.id===payload.id?payload:x));
    case 'ACT_FOLDER_DEL':    return up('activities','folders', list=>list.filter(x=>x.id!==payload));

    // ACTIVITIES — IMAGES
    case 'ACT_IMG_ADD':    return up('activities','images', list=>[...list,payload]);
    case 'ACT_IMG_UPDATE': return up('activities','images', list=>list.map(x=>x.id===payload.id?payload:x));
    case 'ACT_IMG_DEL':    return up('activities','images', list=>list.filter(x=>x.id!==payload));

    // ACTIVITIES — POSTS
    case 'ACT_ADD':    return up('activities', 'posts', list => [...list, payload]);
    case 'ACT_UPDATE': return up('activities', 'posts', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ACT_DEL':    return up('activities', 'posts', list => list.filter(x => x.id !== payload));

    // CAREERS
    case 'CAREER_ADD':    return up('careers', 'jobs', list => [...list, payload]);
    case 'CAREER_UPDATE': return up('careers', 'jobs', list => list.map(x => x.id === payload.id ? payload : x));
    case 'CAREER_DEL':    return up('careers', 'jobs', list => list.filter(x => x.id !== payload));

    // PRODUCTS — AUTO CATEGORIES
    case 'AUTO_CAT_ADD':    return up('products','autoCategories', list=>[...list,payload]);
    case 'AUTO_CAT_UPDATE': return up('products','autoCategories', list=>list.map(x=>x.id===payload.id?payload:x));
    case 'AUTO_CAT_DEL':    return up('products','autoCategories', list=>list.filter(x=>x.id!==payload));

    // PRODUCTS — MOTOR CATEGORIES
    case 'MOTOR_CAT_ADD':    return up('products','motorCategories', list=>[...list,payload]);
    case 'MOTOR_CAT_UPDATE': return up('products','motorCategories', list=>list.map(x=>x.id===payload.id?payload:x));
    case 'MOTOR_CAT_DEL':    return up('products','motorCategories', list=>list.filter(x=>x.id!==payload));

    // PRODUCTS — MOTOR PARTS
    case 'MOTOR_PART_ADD':    return up('products', 'motorParts', list => [...list, payload]);
    case 'MOTOR_PART_UPDATE': return up('products', 'motorParts', list => list.map(x => x.id === payload.id ? payload : x));
    case 'MOTOR_PART_DEL':    return up('products', 'motorParts', list => list.filter(x => x.id !== payload));

    // PRODUCTS — AUTOMOBILE PARTS
    case 'PART_ADD':    return up('products', 'parts', list => [...list, payload]);
    case 'PART_UPDATE': return up('products', 'parts', list => list.map(x => x.id === payload.id ? payload : x));
    case 'PART_DEL':    return up('products', 'parts', list => list.filter(x => x.id !== payload));

    // Internal: hydrate full state from Firestore on first load / real-time updates
    case '__HYDRATE__': {
      const p = payload;
      return {
        home:       { ...initialState.home,       ...p.home },
        about:      { ...initialState.about,       ...p.about },
        activities: {
          ...initialState.activities, ...p.activities,
          folders: p.activities?.folders ?? initialState.activities.folders,
          images:  p.activities?.images  ?? initialState.activities.images,
          posts:   p.activities?.posts   ?? initialState.activities.posts,
        },
        careers:    { ...initialState.careers,     ...p.careers },
        products:   {
          ...initialState.products,
          ...p.products,
          parts:           p.products?.parts           ?? initialState.products.parts,
          motorParts:      p.products?.motorParts      ?? initialState.products.motorParts,
          autoCategories:  p.products?.autoCategories  ?? initialState.products.autoCategories,
          motorCategories: p.products?.motorCategories ?? initialState.products.motorCategories,
        },
      };
    }

    default: return state;
  }
}

// ─── Firebase-powered Context & Provider ─────────────────────────────────────

const CMSContext = createContext(null);

// uid — module-level, always unique
let _counter = 0;
export function uid() {
  return `${Date.now()}-${(++_counter).toString(36)}-${Math.random().toString(36).slice(2,6)}`;
}

// Image compression — max 900px wide, JPEG 75%
function compressImage(dataUrl, maxW = 900, quality = 0.82) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const scale  = img.width > maxW ? maxW / img.width : 1;
      const w      = Math.round(img.width  * scale);
      const h      = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      // Preserve transparency: only use JPEG for non-transparent images
      const isPng = dataUrl.startsWith('data:image/png');
      if (!isPng) {
        // Fill white background for JPEG (avoids black transparency)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      // Use PNG for transparent images, JPEG for everything else
      const format = isPng ? 'image/png' : 'image/jpeg';
      const q      = isPng ? 1 : quality;
      resolve(canvas.toDataURL(format, q));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
export { compressImage };

const FIRESTORE_DOC = 'cms/opt-data';

export function CMSProvider({ children }) {
  const [state,      dispatch]      = useReducer(cmsReducer, initialState);
  const [loading,    setLoading]    = useState(true);   // waiting for first Firestore load
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'

  // ── Load from Firestore on mount, then listen for real-time changes ──────────
  useEffect(() => {
    const [col, docId] = FIRESTORE_DOC.split('/');
    const ref = doc(db, col, docId);

    // Real-time listener — any change in Firestore instantly updates all devices
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        dispatch({ type: '__HYDRATE__', payload: data });
      }
      setLoading(false);
    }, (err) => {
      console.error('[OPT CMS] Firestore listen error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Save to Firestore whenever state changes (debounced 600ms) ───────────────
  const saveTimer = React.useRef(null);
  useEffect(() => {
    // Skip the very first render (loading phase)
    if (loading) return;

    setSaveStatus('saving');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const [col, docId] = FIRESTORE_DOC.split('/');
        // Firestore has a 1MB document limit — check size before saving
        const jsonStr = JSON.stringify(state);
        const sizeKB  = Math.round((new Blob([jsonStr]).size) / 1024);
        if (sizeKB > 950) {
          console.warn(`[OPT CMS] Data size is ${sizeKB}KB — approaching Firestore 1MB limit. Remove large images.`);
          setSaveStatus('error');
          return;
        }
        await setDoc(doc(db, col, docId), state, { merge: true });
        setSaveStatus('saved');
      } catch (err) {
        console.error('[OPT CMS] Firestore save error:', err);
        setSaveStatus('error');
      }
    }, 600);

    return () => clearTimeout(saveTimer.current);
  }, [state, loading]);

  // ── Export JSON ───────────────────────────────────────────────────────────────
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = 'opt_cms_data.json';
    a.click();
  }, [state]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#f3f4f8', gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, border: '4px solid #e5e7eb',
          borderTop: '4px solid #c0392b', borderRadius: '50%',
          animation: 'cms-spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>
          Loading CMS data…
        </p>
        <style>{`@keyframes cms-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <CMSContext.Provider value={{ state, dispatch, uid, exportData, saveStatus }}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be inside <CMSProvider>');
  return ctx;
};