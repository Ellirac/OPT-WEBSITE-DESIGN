import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';

import { db, storage } from '../../admin/firebase.js';
import {
  doc, setDoc, onSnapshot
} from 'firebase/firestore';
import {
  ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage';

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
 *
 * NOTE: parts[].desc and motorParts[].desc are HARDCODED here and NEVER saved to Firestore.
 * They are stripped in stripForFirestore() before every save, and re-merged on __HYDRATE__.
 * To update a description, edit the initialState below and redeploy — zero Firebase cost.
 */
const initialState = {
  home: {
    certifications: [
      { id: 'c1', code: 'ISO 9001',   label: 'Quality Management',       img: null, issuedBy: 'Bureau Veritas', validUntil: '' },
      { id: 'c2', code: 'ISO 14001',  label: 'Environmental Management', img: null, issuedBy: 'Bureau Veritas', validUntil: '' },
      { id: 'c3', code: 'IATF 16949', label: 'Automotive Quality',       img: null, issuedBy: 'Bureau Veritas', validUntil: '' },
      { id: 'c4', code: '5S',         label: 'Workplace Excellence',     img: null, issuedBy: '',              validUntil: '' },
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

    organization: [
      { id: 'o1', name: 'MR. KO OTSUKA',       role: 'OWNER',                img: null },
      { id: 'o2', name: 'MR. KEI OTSUKA',       role: 'CHAIRMAN & PRESIDENT', img: null },
      { id: 'o3', name: 'MS. MARIETTA CANAYON', role: 'OPT-P DIRECTOR',       img: null },
      { id: 'o4', name: 'MR. KIKUO NAKAYAMA',   role: 'VICE-PRESIDENT',       img: null },
    ],

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
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d46900.171157463206!2d139.359019!3d36.063575!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601ed57b986b8a25%3A0x64d3b57b6f18caae!2z5pel5pys44CB44CSMzU1LTA4MTEg5Z-8546J55yM5q-U5LyB6YOh5ruR5bed55S657695bC-77yU77yY77yS!5e1!3m2!1sja!2sph!4v1770796474645!5m2!1sja!2sph',
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

  adminSettings: {
    username: 'admin',
    password: 'OPT@Admin2025',
    recoveryEmail: '',
  },

  activities: {
    folders: [
      { id:'af1', name:'Corporate Events',   date:'2024-01-01' },
      { id:'af2', name:'CSR Activities',     date:'2024-01-01' },
      { id:'af3', name:'Company Milestones', date:'2024-01-01' },
    ],
    images: [],   // each item: { id, url, name, folderId, type:'image'|'video', size, uploadedAt }
    posts: [
      { id: 'a1', title: 'APV Expo Philippines 2025',                   category: 'Event',               youtubeId: 'QNpJaWDy-0Y' },
      { id: 'a2', title: 'Christmas Spirit Program 2024',               category: 'CSR',                 youtubeId: '5GC7A5Wedm8' },
      { id: 'a3', title: 'Inauguration & 30th Anniversary Celebration', category: 'Corporate Milestone', youtubeId: 'vNhD8no4sj4' },
      { id: 'a4', title: 'Annual Company Sportfest 2023',               category: 'Employee Engagement', youtubeId: 'cELpR9JUUww' },
      { id: 'a5', title: 'Community Donation Drive 2023',               category: 'CSR',                 youtubeId: 'XgbeoEwirXM' },
      { id: 'a6', title: 'COVID-19 Prevention & Safety Program',        category: 'Health & Safety',     youtubeId: 'lSA6sG039K4' },
    ],
  },

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
        experience: 'Preferably with experience as a Company Driver',
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

  products: {
    autoCategories: [
      {
        id:'anti', label:'Anti-Vibration Rubber', color:'#e74c3c',
        shortDesc:'Oil, fuel oil, and water resistance — optimized for various automobile applications.',
        desc:'Vulcanized rubber products used for the purpose of suppressing vibration transmission and reducing noise. We mainly optimize the shape and select materials for applications that support various functional units of automobiles.',
      },
      {
        id:'grommet', label:'Grommets', color:'#3498db',
        shortDesc:'Protects cables and hoses from abrasion through metal panels and brackets.',
        desc:'Rubber grommets and insulating parts that protect wiring harnesses, cables, and hoses from abrasion through metal panels and brackets, preventing insulation damage and reducing road noise.',
      },
      {
        id:'seal', label:'Packing Seals', color:'#9b59b6',
        shortDesc:'Oil, fuel oil, water, air, and dust resistance — leak-free sealing performance.',
        desc:'High-performance sealing components resistant to oils, fuel, water, air, and dust. Engineered to prevent leakage across mating surfaces and joints under pressure and temperature cycling.',
      },
      {
        id:'stop', label:'Stopper', color:'#f39c12',
        shortDesc:'Impact absorption and travel limiting for doors, hoods, and tailgates.',
        desc:'Rubber stoppers and bump stops that absorb impact, reduce rattling, and limit the travel range of moving body panels. Protects bodywork and eliminates metal-to-metal contact noise.',
      },
      {
        id:'resin', label:'Resin', color:'#1abc9c',
        shortDesc:'Dimensional stability and chemical resistance for precision automobile parts.',
        desc:'High-precision resin and plastic components used in automobile assemblies requiring strict dimensional accuracy, heat resistance, and resistance to fuel and oil contact.',
      },
    ],

    parts: [
        {
        id:'p1', name:'Exhaust Mount', categoryId:'anti', pinTop:39, pinLeft:86,
        img:null,
        desc:'Rubber mount that isolates exhaust system vibration from the vehicle body, reducing interior noise and preventing metal fatigue in exhaust hangers.',
      },
      {
        id:'p2', name:'Spring Lower Mount', categoryId:'anti', pinTop:35, pinLeft:83,
        img:null,
        desc:'Cushions the coil spring base against the suspension strut, absorbing road shock and preventing metal-to-metal contact that causes noise and wear.',
      },
      {
        id:'p3', name:'Radiator Mount', categoryId:'anti', pinTop:75, pinLeft:20,
        img:null,
        desc:'Isolates the radiator from engine and chassis vibration, protecting cooling fins and hose connections from fatigue cracking over time.',
      },
      {
        id:'p4', name:'Electric Servo Mount', categoryId:'anti', pinTop:48, pinLeft:22,
        img:null,
        desc:'Anti-vibration mount for electric power steering servo motors, dampening motor oscillation to prevent steering wheel shimmy and cabin noise.',
      },
      {
        id:'p5', name:'Fuel Tank Cushion', categoryId:'anti', pinTop:59, pinLeft:66,
        img:null,
        desc:'Rubber cushion placed between the fuel tank and chassis brackets, absorbing vibration and preventing tank surface abrasion during vehicle operation.',
      },
      {
        id:'p6', name:'Stabilizer Bush', categoryId:'anti', pinTop:71, pinLeft:42,
        img:null,
        desc:'Vulcanized rubber bushing that secures the stabilizer bar to the chassis, reducing body roll transfer vibration and controlling lateral movement.',
      },
      {
        id:'p7', name:'Metal Bonding', categoryId:'anti', pinTop:57, pinLeft:41,
        img:null,
        desc:'Rubber-to-metal bonded component combining structural rigidity with vibration damping, used in engine mounts and suspension link assemblies.',
      },
      {
        id:'p8', name:'Hole Grommet', categoryId:'grommet', pinTop:13, pinLeft:58,
        img:null,
        desc:'Rubber grommet inserted into body panel holes to protect wiring harnesses and cables from sharp metal edges, preventing insulation damage and short circuits.',
      },
      {
        id:'p9', name:'Steering Grommet', categoryId:'grommet', pinTop:51, pinLeft:46,
        img:null,
        desc:'Sealing grommet fitted around the steering column pass-through in the firewall, blocking engine bay noise, dust, and moisture from entering the cabin.',
      },
      {
        id:'p10', name:'Head Cover Packing', categoryId:'seal', pinTop:49, pinLeft:33,
        img:null,
        desc:'Precision rubber gasket that seals the valve cover to the cylinder head, preventing engine oil leaks while withstanding high heat and chemical exposure.',
      },
      {
        id:'p11', name:'Fuel Packing', categoryId:'seal', pinTop:62, pinLeft:62,
        img:null,
        desc:'Fuel-resistant rubber seal used at fuel system joints and sender unit flanges, ensuring zero-leak performance under pressure and temperature cycling.',
      },
      {
        id:'p12', name:'Water Pump Packing', categoryId:'seal', pinTop:44, pinLeft:29,
        img:null,
        desc:'Coolant-resistant gasket that seals the water pump housing to the engine block, maintaining system pressure and preventing coolant leaks.',
      },
      {
        id:'p13', name:'Thermomount', categoryId:'seal', pinTop:54, pinLeft:34,
        img:null,
        desc:'Rubber sealing mount for the thermostat housing, combining a leak-proof seal with vibration isolation to protect the thermostat from engine oscillation.',
      },
      {
        id:'p14', name:'Oil Filter Packing', categoryId:'seal', pinTop:56, pinLeft:23,
        img:null,
        desc:'High-pressure rubber seal used at the oil filter base, preventing oil leaks under engine operating pressures and high temperature conditions.',
      },
      {
        id:'p15', name:'Filler Cap', categoryId:'seal', pinTop:50, pinLeft:38,
        img:null,
        desc:'Rubber-sealed filler cap for engine oil or coolant reservoirs, providing an airtight closure that prevents contamination and fluid spillage.',
      },
      {
        id:'p16', name:'Intake Manifold Packing', categoryId:'seal', pinTop:53, pinLeft:28,
        img:null,
        desc:'Seals the intake manifold to the cylinder head ports, preventing air leaks that would disrupt the air-fuel mixture and cause rough engine idle.',
      },
      {
        id:'p17', name:'Tailgate Stopper', categoryId:'stop', pinTop:23, pinLeft:85,
        img:null,
        desc:'Rubber bump stop mounted on the tailgate frame, cushioning the tailgate on closing to prevent panel damage and eliminate metal impact noise.',
      },
      {
        id:'p18', name:'Door Stopper', categoryId:'stop', pinTop:48, pinLeft:68,
        img:null,
        desc:'Rubber stopper that limits door travel at full open position, protecting hinges and adjacent body panels from impact damage during door operation.',
      },
      {
        id:'p19', name:'Trunk Stopper', categoryId:'stop', pinTop:32, pinLeft:88,
        img:null,
        desc:'Bump stop fitted to the trunk lid or boot area, absorbing closing impact force and preventing lid rattle during driving over rough surfaces.',
      },
    ],

    motorCategories: [
      {
        id:'seal', label:'Packing Seals', color:'#3498db',
        shortDesc:'Oil, fuel, and coolant resistance — leak-free sealing across engine joints.',
        desc:'Rubber sealing components that prevent leakage of oil, fuel, coolant, and other fluids across motorcycle engine surfaces. Engineered for high heat cycles and pressure resistance specific to motorcycle applications.',
      },
      {
        id:'frame', label:'Frame Parts', color:'#c0392b',
        shortDesc:'Vibration damping and protection for motorcycle frame and body components.',
        desc:'Rubber and composite parts mounted to the motorcycle frame — including handle grips, step rubbers, fuel tank pads, seat pads, grommets, and heat guards — providing vibration isolation and body protection.',
      },
    ],

    motorParts: [
      {
        id:'m1', name:'Throttle Body Insulator', categoryId:'seal', pinTop:47, pinLeft:56, img:null,
        desc:'Rubber gasket sealing the cylinder head cover to the engine block, preventing oil leaks while withstanding motorcycle engine heat cycles.',
      },
      {
        id:'m2', name:'Diaphragm', categoryId:'seal', pinTop:27, pinLeft:76, img:null,
        desc:'Rubber insulator boot connecting the carburetor to the intake port, sealing the air-fuel path and isolating engine vibration from the carb body.',
      },
      {
        id:'m3', name:'Fuel Packing', categoryId:'seal', pinTop:22, pinLeft:62, img:null,
        desc:'Critical sealing gasket between the cylinder head and engine block, maintaining compression and preventing coolant or oil from entering the combustion chamber.',
      },
      {
        id:'m4', name:'Head Cover Packing', categoryId:'seal', pinTop:47, pinLeft:62, img:null,
        desc:'Crush-type rubber gasket for the engine oil drain plug, ensuring a leak-free seal after every oil change service.',
      },
      {
        id:'m5', name:'Water Pump Packing', categoryId:'seal', pinTop:57, pinLeft:67, img:null,
        desc:'High-temperature rubber gasket at the exhaust pipe flange joint, sealing combustion gases and preventing exhaust leaks that cause noise and performance loss.',
      },
      {
        id:'m6', name:'Oil Filter Packing', categoryId:'seal', pinTop:76, pinLeft:43, img:null,
        desc:'Fuel-resistant rubber seal at the tank-to-frame interface or fuel petcock mounting, preventing fuel leaks and vapor seepage from the tank assembly.',
      },
      {
        id:'m7', name:'Thermo Mount Rubber', categoryId:'seal', pinTop:64, pinLeft:63, img:null,
        desc:'Rubber sealing ring at coolant hose connection points, maintaining system pressure integrity and preventing coolant loss on liquid-cooled motorcycle engines.',
      },
      {
        id:'m8', name:'Handle Grip', categoryId:'frame', pinTop:33, pinLeft:75, img:null,
        desc:'Set of rubber plugs and side-stand pad providing ground grip and frame protection, reducing vibration transfer through the stand and protecting painted surfaces.',
      },
      {
        id:'m9', name:'Step Rubber', categoryId:'frame', pinTop:67, pinLeft:37, img:null,
        desc:'Anti-vibration rubber mount isolating the radiator from frame oscillation, protecting the radiator core and coolant hoses from stress fatigue.',
      },
      {
        id:'m10', name:'Fuel Tank Tray', categoryId:'frame', pinTop:29, pinLeft:53, img:null,
        desc:'Rubber damper assembly for side cover panels, absorbing vibration to prevent panel rattles and protecting cover mounting points from cracking.',
      },
      {
        id:'m11', name:'Fuel Tank Pads', categoryId:'frame', pinTop:29, pinLeft:45, img:null,
        desc:'Combined radiator mounting and dust cover system that secures the radiator while shielding the core from large debris and road contamination.',
      },
      {
        id:'m12', name:'Seat Pads', categoryId:'frame', pinTop:29, pinLeft:26, img:null,
        desc:'Rubber mounting gasket and seal for the tail light assembly, providing weatherproofing and vibration isolation to protect the lamp housing and wiring.',
      },
      {
        id:'m13', name:'USB Charger Cover', categoryId:'frame', pinTop:40, pinLeft:25, img:null,
        desc:'Set of rubber grommets for motorcycle frame pass-through points, protecting wiring harnesses and cables from abrasion against bare metal edges.',
      },
      {
        id:'m14', name:'Grommet', categoryId:'frame', pinTop:42, pinLeft:45, img:null,
        desc:"Rubber handlebar grip with integrated vibration damper, reducing high-frequency engine and road vibration transmitted to the rider's hands for improved comfort.",
      },
      {
        id:'m15', name:'Heat Guard Rubber', categoryId:'frame', pinTop:38, pinLeft:55, img:null,
        desc:'Rubber footpeg pad providing grip and vibration damping for rider comfort, fitted to the footpeg bracket to reduce road and engine vibration through the feet.',
      },
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
    // ADMIN SETTINGS (stored in Firestore for cross-device sync)
    case 'ADMIN_UPDATE_SETTINGS': return { ...state, adminSettings: { ...state.adminSettings, ...payload } };

    // HOME — CERTIFICATIONS
    case 'HOME_ADD_CERT':      return up('home', 'certifications', list => [...list, payload]);
    case 'HOME_UPDATE_CERT':   return up('home', 'certifications', list => list.map(x => x.id === payload.id ? payload : x));
    case 'HOME_DEL_CERT':      return up('home', 'certifications', list => list.filter(x => x.id !== payload));
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
    case 'ACT_FOLDER_ADD':    return up('activities', 'folders', list => [...list, payload]);
    case 'ACT_FOLDER_UPDATE': return up('activities', 'folders', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ACT_FOLDER_DEL':    return up('activities', 'folders', list => list.filter(x => x.id !== payload));

    // ACTIVITIES — IMAGES
    case 'ACT_IMG_ADD':    return up('activities', 'images', list => [...list, payload]);
    case 'ACT_IMG_UPDATE': return up('activities', 'images', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ACT_IMG_DEL':    return up('activities', 'images', list => list.filter(x => x.id !== payload));

    // ACTIVITIES — POSTS
    case 'ACT_ADD':    return up('activities', 'posts', list => [...list, payload]);
    case 'ACT_UPDATE': return up('activities', 'posts', list => list.map(x => x.id === payload.id ? payload : x));
    case 'ACT_DEL':    return up('activities', 'posts', list => list.filter(x => x.id !== payload));

    // CAREERS
    case 'CAREER_ADD':    return up('careers', 'jobs', list => [...list, payload]);
    case 'CAREER_UPDATE': return up('careers', 'jobs', list => list.map(x => x.id === payload.id ? payload : x));
    case 'CAREER_DEL':    return up('careers', 'jobs', list => list.filter(x => x.id !== payload));

    // PRODUCTS — AUTO CATEGORIES
    case 'AUTO_CAT_ADD':    return up('products', 'autoCategories', list => [...list, payload]);
    case 'AUTO_CAT_UPDATE': return up('products', 'autoCategories', list => list.map(x => x.id === payload.id ? payload : x));
    case 'AUTO_CAT_DEL':    return up('products', 'autoCategories', list => list.filter(x => x.id !== payload));

    // PRODUCTS — MOTOR CATEGORIES
    case 'MOTOR_CAT_ADD':    return up('products', 'motorCategories', list => [...list, payload]);
    case 'MOTOR_CAT_UPDATE': return up('products', 'motorCategories', list => list.map(x => x.id === payload.id ? payload : x));
    case 'MOTOR_CAT_DEL':    return up('products', 'motorCategories', list => list.filter(x => x.id !== payload));

    // PRODUCTS — AUTOMOBILE PARTS
    case 'PART_ADD':    return up('products', 'parts', list => [...list, payload]);
    case 'PART_UPDATE': return up('products', 'parts', list => list.map(x => x.id === payload.id ? payload : x));
    case 'PART_DEL':    return up('products', 'parts', list => list.filter(x => x.id !== payload));

    // PRODUCTS — MOTOR PARTS
    case 'MOTOR_PART_ADD':    return up('products', 'motorParts', list => [...list, payload]);
    case 'MOTOR_PART_UPDATE': return up('products', 'motorParts', list => list.map(x => x.id === payload.id ? payload : x));
    case 'MOTOR_PART_DEL':    return up('products', 'motorParts', list => list.filter(x => x.id !== payload));

    // Internal: hydrate one section at a time from Firestore.
    // Each onSnapshot listener fires independently with only its own section key
    // (e.g. { home: ... } or { about: ... }). We must spread ...state first so
    // the other sections are never wiped — this was the root cause of uploaded
    // images disappearing for end users (the race between 5 parallel listeners).
    case '__HYDRATE__': {
      const section  = Object.keys(payload)[0];
      const incoming = payload[section];

      if (!section || !incoming) return state;

      if (section === 'activities') {
        return {
          ...state,
          activities: {
            ...initialState.activities,
            ...incoming,
            folders: incoming.folders ?? state.activities.folders,
            images:  incoming.images  ?? state.activities.images,
            posts:   incoming.posts   ?? state.activities.posts,
          },
        };
      }

      if (section === 'products') {
        return {
          ...state,
          products: {
            ...initialState.products,
            ...incoming,
            autoCategories:  incoming.autoCategories  ?? state.products.autoCategories,
            motorCategories: incoming.motorCategories ?? state.products.motorCategories,
            // For hardcoded parts (p1–p22): use Firestore desc if admin set one,
            // otherwise fall back to source-code desc. Admin-added parts keep all fields as-is.
            parts: (incoming.parts ?? state.products.parts).map(fsPart => {
              const local = initialState.products.parts.find(lp => lp.id === fsPart.id);
              if (local) {
                // Use admin-edited desc from Firestore if present, else source-code desc
                return { ...fsPart, desc: fsPart.desc || local.desc || '' };
              }
              // Admin-added part — keep every field as stored, including desc
              return fsPart;
            }),
            motorParts: (incoming.motorParts ?? state.products.motorParts).map(fsPart => {
              const local = initialState.products.motorParts.find(lp => lp.id === fsPart.id);
              if (local) {
                return { ...fsPart, desc: fsPart.desc || local.desc || '' };
              }
              return fsPart;
            }),
          },
        };
      }

      // home, about, careers — simple merge into current state
      return {
        ...state,
        [section]: { ...initialState[section], ...incoming },
      };
    }

    default: return state;
  }
}

// ─── Strip hardcoded-only fields before saving to Firestore ──────────────────
// We now save desc for ALL parts (including hardcoded ones) so admins can
// customise descriptions without a redeploy. img is also always preserved.
function stripForFirestore(state) {
  return { ...state };
}

// ─── Firebase-powered Context & Provider ─────────────────────────────────────

const CMSContext = createContext(null);

let _counter = 0;
export function uid() {
  return `${Date.now()}-${(++_counter).toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── compressImage (still used for non-activity images e.g. org photos) ────────
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
      const isPng = dataUrl.startsWith('data:image/png');
      if (!isPng) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      const format = isPng ? 'image/png' : 'image/jpeg';
      const q      = isPng ? 1 : quality;
      resolve(canvas.toDataURL(format, q));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
export { compressImage };

// ─── uploadToStorage ─────────────────────────────────────────────────────────
/**
 * Upload a File object to Firebase Storage and return its public download URL.
 *
 * @param {File}     file          - The File object from an <input type="file">
 * @param {string}   folder        - Storage folder, e.g. 'activities/images' or 'activities/videos'
 * @param {Function} onProgress    - Optional callback (0–100) for upload progress
 * @returns {Promise<string>}      - Resolves to the public download URL
 *
 * Usage in your CMS upload handler:
 *   const url = await uploadToStorage(file, 'activities/videos', pct => setProgress(pct));
 *   dispatch({ type: 'ACT_IMG_ADD', payload: { id: uid(), url, name: file.name, folderId } });
 */
export function uploadToStorage(file, folder = 'activities/images', onProgress = null) {
  return new Promise((resolve, reject) => {
    // Build a unique path so filenames never collide
    const ext      = file.name.split('.').pop();
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path     = `${folder}/${safeName}`;
    const fileRef  = storageRef(storage, path);

    const uploadTask = uploadBytesResumable(fileRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(pct);
        }
      },
      (err) => {
        console.error('[CMS] Storage upload error:', err);
        reject(err);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─── deleteFromStorage ────────────────────────────────────────────────────────
/**
 * Delete a file from Firebase Storage by its download URL.
 * Call this when removing an image or video from the CMS so Storage stays clean.
 *
 * Usage:
 *   await deleteFromStorage(image.url);
 *   dispatch({ type: 'ACT_IMG_DEL', payload: image.id });
 */
export async function deleteFromStorage(downloadUrl) {
  try {
    const fileRef = storageRef(storage, downloadUrl);
    await deleteObject(fileRef);
  } catch (err) {
    // Ignore 'object-not-found' — file may have already been deleted
    if (err.code !== 'storage/object-not-found') {
      console.error('[CMS] Storage delete error:', err);
    }
  }
}

// 🔥 MULTI-DOCUMENT SETUP
const CMS_DOCS = {
  home:       doc(db, 'cms', 'home'),
  about:      doc(db, 'cms', 'about'),
  activities: doc(db, 'cms', 'activities'),
  careers:    doc(db, 'cms', 'careers'),
  products:   doc(db, 'cms', 'products'),
};

export function CMSProvider({ children }) {
  const [state,      dispatch]      = useReducer(cmsReducer, initialState);
  const [loading,    setLoading]    = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');

  // 🟢 MULTI-DOC REAL-TIME LISTENERS
  // Wait for ALL 5 docs to respond before hiding the loader so data is
  // fully hydrated before end users see the page.
  useEffect(() => {
    const unsubscribers = [];
    const total  = Object.keys(CMS_DOCS).length;
    let resolved = 0;

    const onResolved = () => {
      resolved += 1;
      if (resolved >= total) setLoading(false);
    };

    Object.entries(CMS_DOCS).forEach(([key, ref]) => {
      const unsub = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          dispatch({
            type: '__HYDRATE__',
            payload: { [key]: snap.data() },
          });
        }
        onResolved();
      }, (err) => {
        console.error(`[CMS] Error loading ${key}:`, err);
        onResolved();
      });

      unsubscribers.push(unsub);
    });

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  // 🟡 SAVE PER SECTION (DEBOUNCED)
  const saveTimer = React.useRef(null);

  useEffect(() => {
    if (loading) return;

    setSaveStatus('saving');
    clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      try {
        const stateToSave = stripForFirestore(state);

        // Optional size check per section
        Object.entries(stateToSave).forEach(([key, val]) => {
          const sizeKB = Math.round(new Blob([JSON.stringify(val)]).size / 1024);
          if (sizeKB > 950) {
            console.warn(`[CMS] ${key} is ${sizeKB}KB (approaching 1MB limit)`);
          }
        });

        await Promise.all([
          setDoc(CMS_DOCS.home,       stateToSave.home,       { merge: true }),
          setDoc(CMS_DOCS.about,      stateToSave.about,      { merge: true }),
          setDoc(CMS_DOCS.activities, stateToSave.activities, { merge: true }),
          setDoc(CMS_DOCS.careers,    stateToSave.careers,    { merge: true }),
          setDoc(CMS_DOCS.products,   stateToSave.products,   { merge: true }),
        ]);

        setSaveStatus('saved');
      } catch (err) {
        console.error('[CMS] Save error:', err);
        setSaveStatus('error');
      }
    }, 600);

    return () => clearTimeout(saveTimer.current);
  }, [state, loading]);

  // 📤 EXPORT
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'opt_cms_data.json';
    a.click();
  }, [state]);

  // ⏳ LOADING UI — neutral spinner, no internal tooling references visible to visitors
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        gap: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #c0392b',
          borderRadius: '50%',
          animation: 'cms-spin 0.8s linear infinite',
        }} />
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