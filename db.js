let db = null;
let useSqlite = false;

try {
  const { DatabaseSync } = require('node:sqlite');
  const path = require('path');
  const DB_PATH = path.join(__dirname, 'campus.db');
  db = new DatabaseSync(DB_PATH);

  // 1. Initialize Tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS clubs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      emoji TEXT,
      members TEXT,
      description TEXT,
      color TEXT,
      dark TEXT,
      extra TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT NOT NULL,
      month TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT,
      time TEXT,
      category TEXT,
      emoji TEXT
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      interest TEXT NOT NULL,
      club_or_event TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec('ALTER TABLE registrations ADD COLUMN club_or_event TEXT;');
  } catch (e) {
    // column already exists
  }

  useSqlite = true;
} catch (err) {
  console.log('Notice: node:sqlite not available on this Node runtime. Using resilient database fallback.');
  useSqlite = false;
}

// 2. Official 42 VIT Pune Clubs Data
const vitClubs = [
  // --- TECHNOLOGY ---
  {
    name: "TRF - The Robotics Forum",
    category: "Technology",
    emoji: "🤖",
    members: "180+ members",
    description: "VIT Pune's premier robotics team. Designing and fabricating national-level autonomous bots, Robocon contenders, and combat robots.",
    color: "#e7e6fa",
    dark: "#7770b5",
    extra: "ABU Robocon · Combat Robotics · ROS & Embedded Systems"
  },
  {
    name: "GDG On Campus VIT Pune",
    category: "Technology",
    emoji: "🌐",
    members: "320+ members",
    description: "Google Developer Groups student chapter bringing hands-on Flutter, Google Cloud, Android, and Web Solution Challenges.",
    color: "#dce8fa",
    dark: "#4285f4",
    extra: "Google Cloud study jams · Android sprints · Solution Challenge"
  },
  {
    name: "MLSC VIT Pune",
    category: "Technology",
    emoji: "💻",
    members: "210+ members",
    description: "Microsoft Learn Student Club driving AI, Azure cloud architecture, machine learning workshops, and campus hackathons.",
    color: "#e3effa",
    dark: "#0078d4",
    extra: "Microsoft Azure certifications · AI & ML projects · Imagine Cup"
  },
  {
    name: "CSI Student Branch, VIT Pune",
    category: "Technology",
    emoji: "⌘",
    members: "280+ members",
    description: "Computer Society of India student branch organizing flagship technical symposia, coding marathons, and software bootcamps.",
    color: "#e8effe",
    dark: "#3f51b5",
    extra: "Annual tech symposiums · Competitive coding · Peer mentoring"
  },
  {
    name: "GedIT Coding Club",
    category: "Technology",
    emoji: "⚡",
    members: "190+ members",
    description: "Algorithmic thinking, data structures, competitive programming contests on LeetCode/Codeforces, and peer code reviews.",
    color: "#dff2ea",
    dark: "#2e7d32",
    extra: "Weekly problem sets · ICPC prep · Open-source sprints"
  },
  {
    name: "GameDev+",
    category: "Technology",
    emoji: "🎮",
    members: "140+ members",
    description: "Building games from scratch using Unity, Unreal Engine, Blender 3D asset design, game physics, and annual campus Game Jams.",
    color: "#f3e5f5",
    dark: "#7b1fa2",
    extra: "Unity & Unreal Engine · 3D game assets · 48hr Game Jams"
  },
  {
    name: "SIG RealitySpectra",
    category: "Technology",
    emoji: "🥽",
    members: "95+ members",
    description: "Special Interest Group exploring Augmented Reality (AR), Virtual Reality (VR), spatial computing, WebXR, and Metaverse dev.",
    color: "#e0f7fa",
    dark: "#00838f",
    extra: "Meta Quest dev · WebXR & Unity AR · Spatial audio & 3D UI"
  },
  {
    name: "IEEE Student Branch VIT Pune",
    category: "Technology",
    emoji: "📡",
    members: "260+ members",
    description: "The global IEEE community at VIT Pune fostering research publications, hardware electronics, IoT, and international conferences.",
    color: "#e1f5fe",
    dark: "#0277bd",
    extra: "IEEE research papers · Hardware design · Global networking"
  },
  {
    name: "IEEE IMS Student Chapter",
    category: "Technology",
    emoji: "🔬",
    members: "110+ members",
    description: "Instrumentation and Measurement Society focusing on smart sensor arrays, telemetry, industrial instrumentation, and data acquisition.",
    color: "#ede7f6",
    dark: "#512da8",
    extra: "Sensor calibrations · Embedded telemetry · Lab practicals"
  },
  {
    name: "Quark VIT Pune",
    category: "Technology",
    emoji: "⚛️",
    members: "85+ members",
    description: "Pioneering high-performance computing, quantum algorithms, parallel processing, and cutting-edge deep tech research.",
    color: "#fce4ec",
    dark: "#c2185b",
    extra: "Supercomputing · Quantum computing logic · GPU acceleration"
  },
  {
    name: "ISA VIT Pune Student Section",
    category: "Technology",
    emoji: "⚙️",
    members: "150+ members",
    description: "International Society of Automation providing real industrial automation training: PLC programming, SCADA, and control loops.",
    color: "#e8f5e9",
    dark: "#2e7d32",
    extra: "PLC & SCADA · Industrial automation visits · Process control"
  },
  {
    name: "CSA - Computer Students Association",
    category: "Technology",
    emoji: "🖥️",
    members: "310+ members",
    description: "The core Computer Engineering student association hosting hackathons, developer bootcamps, and department tech fests.",
    color: "#fff3e0",
    dark: "#e65100",
    extra: "Department flagship events · Senior-junior mentorship · Hackathons"
  },
  {
    name: "MESA - Mechanical Engineering Students Association",
    category: "Technology",
    emoji: "🛠️",
    members: "230+ members",
    description: "Uniting mechanical engineers for SolidWorks/CATIA design jams, finite element analysis, thermal engineering, and plant visits.",
    color: "#fbe9e7",
    dark: "#d84315",
    extra: "CAD/CAM modeling · Industrial plant tours · Mech workshops"
  },
  {
    name: "ChESA VIT Pune",
    category: "Technology",
    emoji: "🧪",
    members: "120+ members",
    description: "Chemical Engineering Students Association exploring industrial chemical processes, green chemistry, and plant simulations.",
    color: "#e0f2f1",
    dark: "#00695c",
    extra: "Chem CAD simulation · Industrial safety · Green technology"
  },
  {
    name: "DESH SA VIT Pune",
    category: "Technology",
    emoji: "📐",
    members: "350+ members",
    description: "Department of Engineering Sciences & Humanities Student Association guiding first-year students in academics, projects, and innovation.",
    color: "#fff8e1",
    dark: "#f57f17",
    extra: "First-year induction · Applied sciences expo · Foundation skills"
  },
  {
    name: "Ekasutram - VIT Pune",
    category: "Technology",
    emoji: "🔢",
    members: "105+ members",
    description: "A celebration of mathematics, cryptography, quantitative algorithms, puzzle solving, and analytical reasoning.",
    color: "#f1f8e9",
    dark: "#558b2f",
    extra: "Math Olympiads · Cryptography challenges · Quant finance logic"
  },
  {
    name: "Antariksh Club VI",
    category: "Technology",
    emoji: "🚀",
    members: "175+ members",
    description: "Astronomy and space science society organizing night-sky stargazing expeditions, telescope viewing, and aerospace engineering talks.",
    color: "#e8eaf6",
    dark: "#283593",
    extra: "Night stargazing trips · Planetary telescopes · Rocketry basics"
  },
  {
    name: "Team Griffin India",
    category: "Technology",
    emoji: "🛩️",
    members: "80+ members",
    description: "Aero-design team designing, fabricating, and flying high-lift RC aircraft and autonomous drones for SAE Aero Design competitions.",
    color: "#e0f7fa",
    dark: "#006064",
    extra: "SAE Aero Design · Autonomous UAVs · Aerodynamics & CFD"
  },

  // --- SPORTS & RACING ---
  {
    name: "Veloce Racing India",
    category: "Sports",
    emoji: "🏎️",
    members: "90+ members",
    description: "VIT Pune's championship Formula Student team building high-performance combustion and electric race cars from scratch.",
    color: "#ffebee",
    dark: "#c62828",
    extra: "Formula Bharat · EV powertrain · Telemetry & chassis design"
  },
  {
    name: "Team Endurance Racing",
    category: "Sports",
    emoji: "🚜",
    members: "85+ members",
    description: "Designing, building, and racing all-terrain vehicles (ATVs) for national BAJA SAE off-road endurance challenges.",
    color: "#efebe9",
    dark: "#4e342e",
    extra: "BAJA SAE India · Off-road ATV testing · Custom suspension"
  },
  {
    name: "Chess Champions Club (C-Cube)",
    category: "Sports",
    emoji: "♟️",
    members: "160+ members",
    description: "Home of campus chess masters. Weekly blitz tourneys, tactical opening analyses, and representing VIT in inter-college championships.",
    color: "#f5f5f5",
    dark: "#212121",
    extra: "Weekly blitz meets · Simultaneous exhibitions · FIDE guidance"
  },

  // --- ARTS & CULTURE ---
  {
    name: "Aaroh",
    category: "Arts",
    emoji: "🎤",
    members: "120+ members",
    description: "The celebrated Indian music band of VIT Pune bringing vocalists, rhythmists, and classical instrumentalists together.",
    color: "#fce4ec",
    dark: "#ad1457",
    extra: "Melange music nights · Fusion jams · Live studio sessions"
  },
  {
    name: "ZEPHYR",
    category: "Arts",
    emoji: "💃",
    members: "130+ members",
    description: "VIT Pune's premier western dance crew known for electrifying hip-hop, contemporary, urban choreographies, and national battle titles.",
    color: "#ede7f6",
    dark: "#4527a0",
    extra: "Inter-collegiate dance trophies · Flashmobs · Dance battles"
  },
  {
    name: "VIT Cultural Productions (VICULP)",
    category: "Arts",
    emoji: "🎭",
    members: "165+ members",
    description: "The official dramatic society of VIT Pune dominating Purushottam Karandak, Firodiya Karandak, one-act plays, and street theatre.",
    color: "#fff3e0",
    dark: "#d84315",
    extra: "Purushottam Karandak · Scriptwriting · Stagecraft & acting"
  },
  {
    name: "V-Click Multimedia Prod.",
    category: "Arts",
    emoji: "📸",
    members: "140+ members",
    description: "The visual storytellers behind VIT Pune. Covering major fests, photography walks, cinematography, color grading, and video editing.",
    color: "#e0f2f1",
    dark: "#004d40",
    extra: "Campus photo coverage · Video editing & VFX · Photo walks"
  },
  {
    name: "VIT Pune Unplugged",
    category: "Arts",
    emoji: "🎸",
    members: "115+ members",
    description: "Acoustic music collective hosting open mic evenings, indie rock jam sessions, singer-songwriter circles, and amphitheatre concerts.",
    color: "#fbe9e7",
    dark: "#bf360c",
    extra: "Acoustic jam nights · Open mics · Indie song releases"
  },
  {
    name: "Vaatchal - VIT, Pune",
    category: "Arts",
    emoji: "📖",
    members: "135+ members",
    description: "Preserving and celebrating Marathi literature, poetry recitation, cultural heritage, and publishing the official campus annual magazine.",
    color: "#f9fbe7",
    dark: "#827717",
    extra: "Annual college magazine · Kavi sammelan · Literary debates"
  },
  {
    name: "Vishwakarma Expression Hub",
    category: "Arts",
    emoji: "✍️",
    members: "125+ members",
    description: "A sanctuary for wordsmiths: creative writing, slam poetry, book club discussions, blogging, and expressive storytelling.",
    color: "#e8f5e9",
    dark: "#1b5e20",
    extra: "Slam poetry nights · Micro-fiction contests · Book reviews"
  },

  // --- COMMUNITY, LEADERSHIP & WELFARE ---
  {
    name: "TEDxVITPune",
    category: "Community",
    emoji: "🎙️",
    members: "150+ members",
    description: "Organizing VIT Pune's official independently organized TED event, inviting visionaries, authors, scientists, and industry leaders to inspire.",
    color: "#ffebee",
    dark: "#b71c1c",
    extra: "Annual TEDx conference · Idea curation · Media & sponsorships"
  },
  {
    name: "VishwaConclave",
    category: "Community",
    emoji: "🏛️",
    members: "170+ members",
    description: "VIT Pune's flagship national youth conclave hosting prominent leaders, entrepreneurs, artists, and diplomats in high-energy speaker summits.",
    color: "#fffde7",
    dark: "#f57f17",
    extra: "National speaker summit · VIP management · Youth leadership"
  },
  {
    name: "VIT Pune MUN",
    category: "Community",
    emoji: "🌍",
    members: "145+ members",
    description: "Model United Nations society grooming future diplomats in geopolitics, international policy resolution, and crisis committees.",
    color: "#e1f5fe",
    dark: "#01579b",
    extra: "Annual Model UN conference · Debate simulations · Crisis squads"
  },
  {
    name: "EDC VIT Pune",
    category: "Community",
    emoji: "💡",
    members: "200+ members",
    description: "Entrepreneurship Development Cell nurturing startup ideas, venture bootcamps, angel investor pitch sessions, and the annual E-Summit.",
    color: "#e8eaf6",
    dark: "#1a237e",
    extra: "Annual E-Summit · Pitching to VCs · Startup incubation"
  },
  {
    name: "Speaker's Club VIT Pune",
    category: "Community",
    emoji: "🗣️",
    members: "130+ members",
    description: "Empowering students through parliamentary debates, extempore speeches, group discussions, and persuasive public communication.",
    color: "#f3e5f5",
    dark: "#4a148c",
    extra: "Parliamentary debating · Extempore rounds · GD preparation"
  },
  {
    name: "PD Club (Personality Development)",
    category: "Community",
    emoji: "🌟",
    members: "140+ members",
    description: "Sharpening corporate readiness, interview mastery, non-verbal communication, personal branding, and soft skill excellence.",
    color: "#fff3e0",
    dark: "#e65100",
    extra: "Mock interviews · Resume crafting · Corporate grooming"
  },
  {
    name: "NSS UNIT A65 | Socials",
    category: "Community",
    emoji: "🤝",
    members: "290+ members",
    description: "National Service Scheme unit driving impactful blood donation camps, rural literacy, cleanliness drives, and social welfare projects.",
    color: "#e8f5e9",
    dark: "#2e7d32",
    extra: "Blood donation drives · Rural outreach camps · Tree plantation"
  },
  {
    name: "Abhivriddhi, VIT Pune",
    category: "Community",
    emoji: "🌱",
    members: "110+ members",
    description: "Community uplifting initiatives focusing on educating underprivileged children, community food drives, and environmental care.",
    color: "#f1f8e9",
    dark: "#33691e",
    extra: "Underprivileged tutoring · Environmental awareness · Relief drives"
  },
  {
    name: "The Investment Forum (TIF)",
    category: "Community",
    emoji: "📈",
    members: "160+ members",
    description: "Financial literacy and investing society: fundamental equity research, technical charts, derivatives, crypto, and macroeconomics.",
    color: "#e0f2f1",
    dark: "#004d40",
    extra: "Virtual portfolio trading · Stock analysis · Wealth creation"
  },
  {
    name: "Indus Connect (ICON)",
    category: "Community",
    emoji: "🔗",
    members: "125+ members",
    description: "Bridging campus with corporate giants: corporate leadership sessions, alumni mentorship networks, and industry visit programs.",
    color: "#e8effe",
    dark: "#1565c0",
    extra: "Alumni roundtables · Corporate connect · Internship pathways"
  },
  {
    name: "Vishwa Shauryam",
    category: "Community",
    emoji: "🎖️",
    members: "100+ members",
    description: "Dedicated to armed forces and defense services aspirants: SSB interview training, physical drills, and military history seminars.",
    color: "#efebe9",
    dark: "#3e2723",
    extra: "SSB interview prep · Physical stamina training · Defense talks"
  },
  {
    name: "Student Council VIT Pune",
    category: "Community",
    emoji: "🎓",
    members: "380+ members",
    description: "The apex student governing council representing student voices, coordinating major campus festivals like Melange & Vishwakarandak.",
    color: "#fff8e1",
    dark: "#ff6f00",
    extra: "Melange & Vishwakarandak · Campus elections · Student welfare"
  },
  {
    name: "Lighthearted Lounge",
    category: "Community",
    emoji: "☕",
    members: "95+ members",
    description: "A cozy campus mental health and wellbeing space for de-stressing, heartfelt conversations, mindfulness, and creative unwinding.",
    color: "#fce4ec",
    dark: "#880e4f",
    extra: "Mental health circles · De-stress hours · Open mic talks"
  },
  {
    name: "Student Development Program (SDP)",
    category: "Community",
    emoji: "🚀",
    members: "170+ members",
    description: "Professional capability building: industry-demanded skill certifications, leadership retreats, and career mentorship roadmaps.",
    color: "#e1f5fe",
    dark: "#0277bd",
    extra: "Technical skill certification · Leadership workshops · Mentorship"
  }
];

if (useSqlite && db) {
  // Always re-sync all 42 official clubs into the database
  db.exec('DELETE FROM clubs;');
  const insertClub = db.prepare(`
    INSERT INTO clubs (name, category, emoji, members, description, color, dark, extra)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of vitClubs) {
    insertClub.run(c.name, c.category, c.emoji, c.members, c.description, c.color, c.dark, c.extra);
  }
}

// 3. Ensure Default Events
// 3. Official Verified VIT Pune Events Data Starting From 1 November
const vitEvents = [
  {
    day: "01",
    month: "NOV",
    name: "Melange Inauguration & Campus Induction Gala",
    description: "Grand opening night of the November fest season with live band overtures, club pavilions, and orientation showcases.",
    type: "CULTURAL",
    time: "05:00 PM · Open Air Amphitheatre",
    category: "Arts",
    emoji: "🎉"
  },
  {
    day: "04",
    month: "NOV",
    name: "Hacktovate 2026: Flagship 24hr Hackathon",
    description: "Organized by CSI & technical chapters: 24hr offline sprint solving industry AI, Web, Cloud, and Fintech challenges.",
    type: "COMPETITION",
    time: "09:00 AM · Central Computing Lab",
    category: "Technology",
    emoji: "💻"
  },
  {
    day: "07",
    month: "NOV",
    name: "RoboCon Arena & CircuitCraft Bootcamp (TRF)",
    description: "VIT Pune's premier Robotics Forum showcasing national ABU Robocon bots, obstacle arenas, and PCB hardware fabrication.",
    type: "WORKSHOP",
    time: "02:00 PM · Mechanical Workshop Hall",
    category: "Technology",
    emoji: "🤖"
  },
  {
    day: "10",
    month: "NOV",
    name: "TEDxVITPune: Ideas Worth Spreading",
    description: "Independently organized TED conference curating inspiring visionaries, authors, scientists, and industry icons.",
    type: "CONFERENCE",
    time: "10:00 AM · Sharad Arena",
    category: "Community",
    emoji: "🎙️"
  },
  {
    day: "13",
    month: "NOV",
    name: "Vishwakarandak: Inter-Department Championship",
    description: "The fierce annual clash between CS, IT, Mech, EnTC, and Chemical for departmental glory in sports, dance, and drama.",
    type: "CULTURAL",
    time: "04:30 PM · Main Auditorium",
    category: "Arts",
    emoji: "💃"
  },
  {
    day: "16",
    month: "NOV",
    name: "Vishwapreneur 2026: National E-Summit (V-EDC)",
    description: "Pune's biggest student-led entrepreneurship summit: live pitching to VCs, angel investors, and unicorn startup founders.",
    type: "COMPETITION",
    time: "10:30 AM · Innovation Center",
    category: "Community",
    emoji: "💡"
  },
  {
    day: "19",
    month: "NOV",
    name: "Formula Student Rollout & Telemetry (Veloce Racing)",
    description: "Official public track unveiling of Veloce Racing's custom-engineered electric racecar and live telemetry demonstration.",
    type: "EXHIBITION",
    time: "03:00 PM · Central Campus Oval",
    category: "Sports",
    emoji: "🏎️"
  },
  {
    day: "22",
    month: "NOV",
    name: "BAJA SAE Off-Road Obstacle Trials (Team Endurance)",
    description: "Suspension testing, mud terrain climbs, and dynamic trials of VIT Pune's national BAJA all-terrain vehicle.",
    type: "SPORTS",
    time: "09:30 AM · Off-road Test Ground",
    category: "Sports",
    emoji: "🚜"
  },
  {
    day: "25",
    month: "NOV",
    name: "VIT Pune MUN: Global Diplomacy & Crisis Summit",
    description: "Flagship Model United Nations conference simulating international crisis response and multilateral geopolitical debates.",
    type: "CONFERENCE",
    time: "09:00 AM · Conference Hall 1",
    category: "Community",
    emoji: "🌍"
  },
  {
    day: "28",
    month: "NOV",
    name: "Aaroh & Unplugged Courtyard Acoustic Jam",
    description: "A starlit open-air campus evening featuring soulful acoustic sets, indie rhythms, and live student jam performances.",
    type: "CULTURAL",
    time: "06:00 PM · Student Plaza Courtyard",
    category: "Arts",
    emoji: "🎸"
  },
  {
    day: "02",
    month: "DEC",
    name: "VishwaConclave: National Youth Leadership Summit",
    description: "Interactive conclave bringing high-profile national speakers, policymakers, and prominent authors to VIT Pune.",
    type: "CONFERENCE",
    time: "10:30 AM · Main Auditorium",
    category: "Community",
    emoji: "🏛️"
  },
  {
    day: "06",
    month: "DEC",
    name: "Firodiya & Purushottam Drama Showcase (VICULP)",
    description: "VIT Cultural Productions' one-act Marathi and Hindi stage plays prepared for prestigious collegiate theatre competitions.",
    type: "CULTURAL",
    time: "05:30 PM · Main Auditorium",
    category: "Arts",
    emoji: "🎭"
  }
];

if (useSqlite && db) {
  // Always re-sync all official verified events starting from 1 November into the database
  db.exec('DELETE FROM events;');
  const insertEvent = db.prepare(`
    INSERT INTO events (day, month, name, description, type, time, category, emoji)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const e of vitEvents) {
    insertEvent.run(e.day, e.month, e.name, e.description, e.type, e.time, e.category, e.emoji);
  }

  // 4. Database Helper Functions (SQLite)
  module.exports = {
    getClubs: () => db.prepare('SELECT * FROM clubs ORDER BY id ASC').all(),
    getEvents: () => db.prepare('SELECT * FROM events ORDER BY id ASC').all(),
    addEvent: ({ day, month, name, description, type, time, category, emoji }) => {
      const stmt = db.prepare(`
        INSERT INTO events (day, month, name, description, type, time, category, emoji)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(day, month, name, description, type, time, category, emoji || '📌');
      return { id: info.lastInsertRowid };
    },
    deleteEvent: (id) => {
      db.prepare('DELETE FROM events WHERE id = ?').run(id);
      return { success: true };
    },
    saveRegistration: ({ name, email, interest, club_or_event }) => {
      const stmt = db.prepare(`
        INSERT INTO registrations (name, email, interest, club_or_event)
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(name, email, interest, club_or_event || interest);
      return { id: info.lastInsertRowid };
    },
    getRegistrations: () => {
      return db.prepare('SELECT * FROM registrations ORDER BY id DESC').all();
    },
    deleteRegistration: (id) => {
      db.prepare('DELETE FROM registrations WHERE id = ?').run(id);
      return { success: true };
    }
  };
} else {
  // 4. Resilient In-Memory Fallback for Node 18/20 cloud environments
  let fallbackRegistrations = [];
  let fallbackEvents = vitEvents.map((e, idx) => ({ id: idx + 1, ...e }));
  let fallbackClubs = vitClubs.map((c, idx) => ({ id: idx + 1, ...c }));

  module.exports = {
    getClubs: () => fallbackClubs,
    getEvents: () => fallbackEvents,
    addEvent: ({ day, month, name, description, type, time, category, emoji }) => {
      const newEvent = {
        id: fallbackEvents.length > 0 ? Math.max(...fallbackEvents.map(e => e.id)) + 1 : 1,
        day, month, name, description, type, time, category, emoji: emoji || '📌'
      };
      fallbackEvents.push(newEvent);
      return { id: newEvent.id };
    },
    deleteEvent: (id) => {
      fallbackEvents = fallbackEvents.filter(e => e.id !== Number(id));
      return { success: true };
    },
    saveRegistration: ({ name, email, interest, club_or_event }) => {
      const newReg = {
        id: fallbackRegistrations.length > 0 ? Math.max(...fallbackRegistrations.map(r => r.id)) + 1 : 1,
        name,
        email,
        interest,
        club_or_event: club_or_event || interest,
        created_at: new Date().toISOString()
      };
      fallbackRegistrations.unshift(newReg);
      return { id: newReg.id };
    },
    getRegistrations: () => fallbackRegistrations,
    deleteRegistration: (id) => {
      fallbackRegistrations = fallbackRegistrations.filter(r => r.id !== Number(id));
      return { success: true };
    }
  };
}
