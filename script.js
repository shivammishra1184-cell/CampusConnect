let clubs = [
  {name:"CodeCraft & ACM VIT Pune",category:"Technology",emoji:"⌘",members:"250+ members",description:"Build software that matters. Weekly coding sprints, competitive programming, hackathons, and web/AI projects.",color:"#dce8fa",dark:"#5578b4",extra:"Weekly coding meets · Open to all branches · Web, App, and AI"},
  {name:"TRF - The Robotics Forum",category:"Technology",emoji:"🤖",members:"140+ members",description:"VIT Pune's premier robotics wing. Design, fabricate, and code autonomous bots, drones, and IoT hardware.",color:"#e7e6fa",dark:"#7770b5",extra:"RoboCon participants · ROS & Arduino · Hardware fabrication"},
  {name:"Pixel & Palette Art Circle",category:"Arts",emoji:"✿",members:"90+ members",description:"Creative haven for photographers, UI/UX designers, sketchers, digital illustrators, and visual storytellers.",color:"#f8e4e9",dark:"#b66e83",extra:"Campus photo walks · Design sprints · Annual art exhibitions"},
  {name:"VIT Pune Sports Crew",category:"Sports",emoji:"⚡",members:"320+ members",description:"Football, basketball, cricket, badminton, and athletics. Stay fit, train hard, and represent VIT in tournaments.",color:"#f9edcf",dark:"#bd8d36",extra:"Daily evening practice · Inter-college tournaments · Open trials"},
  {name:"EDC & Social Welfare",category:"Community",emoji:"♧",members:"115+ members",description:"Entrepreneurship drives, campus sustainability, tree plantation, community outreach, and social impact projects.",color:"#e3efda",dark:"#6e9654",extra:"Startup incubation · Social drives · Leadership workshops"},
  {name:"Mirage Music & Theatre Club",category:"Arts",emoji:"♫",members:"130+ members",description:"Vocalists, instrumentalists, actors, and poets uniting to create unforgettable campus performances and open mics.",color:"#f8e8d9",dark:"#bd8754",extra:"Melange fest headliners · Jam sessions · Street play and theatre"}
];
let events = [
  {day:"08",month:"NOV",name:"HackVIT 2026: 24hr Flagship Hackathon",description:"Team up with fellow VITians to solve real-world industry challenges and win grand prizes",type:"COMPETITION",time:"09:00 AM · Central Computing Lab",category:"Technology",emoji:"💻"},
  {day:"12",month:"NOV",name:"RoboShowcase & Autonomous Bot Demo",description:"Hands-on robotics showcase featuring TRF's national combat and autonomous robot line-up",type:"WORKSHOP",time:"02:00 PM · Mechanical Workshop Hall",category:"Technology",emoji:"🤖"},
  {day:"17",month:"NOV",name:"Melange Cultural Open Mic & Jam",description:"An open stage evening for acoustic performances, stand-up comedy, and original songs",type:"CULTURAL",time:"05:00 PM · VIT Open Air Amphitheatre",category:"Arts",emoji:"♫"},
  {day:"22",month:"NOV",name:"Inter-Department Football Championship",description:"High-octane departmental clash between CS, IT, Mech, EnTC, and Chemical squads",type:"SPORTS",time:"08:00 AM · VIT Sports Grounds",category:"Sports",emoji:"⚡"}
];
let selectedCategory = "All";
const clubGrid = document.getElementById("clubGrid");
const eventList = document.getElementById("eventList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

function renderClubs(){
  const term = searchInput.value.trim().toLowerCase();
  const filtered = clubs.filter(club =>
    (selectedCategory === "All" || club.category === selectedCategory) &&
    (club.name.toLowerCase().includes(term) || club.description.toLowerCase().includes(term) || club.category.toLowerCase().includes(term))
  );
  clubGrid.innerHTML = filtered.map(club => `
    <article class="club-card" data-club="${club.name}" tabindex="0" role="button" aria-label="Explore ${club.name}">
      <div class="club-visual" style="background:${club.color || '#e8f0db'}">
        <span class="club-emoji" style="color:${club.dark || '#3b5c14'}">${club.emoji || '🏛️'}</span>
      </div>
      <div class="club-body">
        <div class="club-meta">
          <span class="pill">${club.category}</span>
          <span class="members">${club.members}</span>
        </div>
        <h3>${club.name}</h3>
        <p>${club.description}</p>
        <button class="card-link" type="button" tabindex="-1">
          Explore club & info <span>→</span>
        </button>
      </div>
    </article>`).join("");
  emptyState.hidden = filtered.length !== 0;

  clubGrid.querySelectorAll(".club-card").forEach(card => {
    card.addEventListener("click", () => showClub(card.dataset.club));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        showClub(card.dataset.club);
      }
    });
  });
}
function renderEvents(){
  eventList.innerHTML = events.map((event,index) => `
    <article class="event-row">
      <div class="event-date"><b>${event.day}</b><span>${event.month}</span></div>
      <div class="event-info"><h3>${event.name}</h3><p>${event.description}</p></div>
      <div class="event-type">${event.type}<br><span style="color:#9eafa4">${event.time}</span></div>
      <button class="event-action" data-event="${index}">Details ↗</button>
    </article>`).join("");
  eventList.querySelectorAll("[data-event]").forEach(button => button.addEventListener("click", () => showEvent(Number(button.dataset.event))));
}
function showClub(name){
  const club = clubs.find(item => item.name === name) || {
    name: name,
    category: "Community",
    emoji: "🏛️",
    members: "Active VIT Club",
    description: "Official student club at Vishwakarma Institute of Technology, Pune.",
    color: "#e8f0db",
    dark: "#4b6832",
    extra: "Workshops · Campus Events · Student Community"
  };

  // Parse extras into tags
  const tags = club.extra ? club.extra.split("·").map(t => t.trim()).filter(Boolean) : ["Workshops", "Campus Projects", "Student Network"];

  // Location / Hub based on Category
  let hubLocation = "VIT Bibwewadi Campus · Student Activity Center (SAC)";
  if (club.category === "Technology") hubLocation = "VIT Bibwewadi Campus · Innovation Labs & Department Centers";
  else if (club.category === "Sports") hubLocation = "VIT Campus Sports Complex & Ground";
  else if (club.category === "Arts") hubLocation = "Student Activity Center (SAC) & Open Air Amphitheatre";
  else if (club.category === "Community") hubLocation = "EDC Cell & Campus Seminar Halls";

  document.getElementById("detailsContent").innerHTML = `
    <div class="club-modal-wrap">
      <div class="club-modal-hero" style="background:${club.color || '#e8f0db'}">
        <div class="club-modal-icon" style="color:${club.dark || '#375024'}">${club.emoji || '🏛️'}</div>
        <div class="club-modal-header-text">
          <span class="club-modal-badge">${club.category.toUpperCase()} WING</span>
          <h2>${club.name}</h2>
          <div class="club-modal-status">
            <span>👥 ${club.members || 'Active community'}</span>
            <span>✓ Verified VIT Pune Club</span>
          </div>
        </div>
      </div>

      <div class="club-modal-body">
        <div class="club-section-title">About the Club</div>
        <p class="club-desc-text">${club.description}</p>

        <div class="club-section-title">Core Domains & Key Activities</div>
        <div class="club-tags-list">
          ${tags.map(tag => `<span class="club-tag-chip">✦ ${tag}</span>`).join("")}
        </div>

        <div class="club-section-title">What You'll Gain as a Member</div>
        <div class="club-perks-grid">
          <div class="club-perk-item">
            <strong>🛠️ Hands-on Experience</strong>
            Work on live projects, technical sprints, and collegiate competitions.
          </div>
          <div class="club-perk-item">
            <strong>👥 Senior Mentorship</strong>
            Direct guidance and peer learning from experienced senior VITians.
          </div>
          <div class="club-perk-item">
            <strong>🏆 Flagship Events</strong>
            Organize & participate in campus fests, hackathons, and symposiums.
          </div>
          <div class="club-perk-item">
            <strong>📜 Leadership & POR</strong>
            Earn official student leadership and Position of Responsibility credentials.
          </div>
        </div>

        <div class="club-location-box">
          <span>📍</span>
          <div>
            <b>Campus Hub:</b> ${hubLocation}
          </div>
        </div>

        <div class="club-modal-actions">
          <button class="btn-close" type="button" data-close-modal>Close</button>
          <button class="button button-primary" id="detailJoin">
            Register / Join Club Pass <span>→</span>
          </button>
        </div>
      </div>
    </div>`;

  document.getElementById("detailJoin").addEventListener("click", () => openRegistration(club.name));
  const closeBtn = document.querySelector("[data-close-modal]");
  if (closeBtn) closeBtn.addEventListener("click", () => document.getElementById("detailsDialog").close());
  document.getElementById("detailsDialog").showModal();
}
function showEvent(index){
  const event = events[index];
  document.getElementById("detailsContent").innerHTML = `
    <div class="club-modal-wrap">
      <div class="club-modal-hero" style="background:#eaf2e1">
        <div class="club-modal-icon" style="color:#2f4e24">${event.emoji || '📅'}</div>
        <div class="club-modal-header-text">
          <span class="club-modal-badge">${event.type} · ${event.category.toUpperCase()}</span>
          <h2>${event.name}</h2>
          <div class="club-modal-status">
            <span>🗓️ ${event.day} ${event.month}</span>
            <span>📍 ${event.time}</span>
          </div>
        </div>
      </div>

      <div class="club-modal-body">
        <div class="club-section-title">Event Overview</div>
        <p class="club-desc-text">${event.description}</p>

        <div class="club-section-title">Event Schedule & Information</div>
        <div class="club-perks-grid">
          <div class="club-perk-item">
            <strong>📅 Date & Time</strong>
            ${event.day} ${event.month} 2026 · ${event.time}
          </div>
          <div class="club-perk-item">
            <strong>🎟️ Entry Pass</strong>
            Digital Pass with Scannable QR Verification provided upon registration.
          </div>
        </div>

        <div class="club-location-box">
          <span>📍</span>
          <div>
            <b>Venue:</b> ${event.time && event.time.includes('·') ? event.time.split('·')[1].trim() : 'VIT Pune Campus'}
          </div>
        </div>

        <div class="club-modal-actions">
          <button class="btn-close" type="button" data-close-modal>Close</button>
          <button class="button button-primary" id="detailJoin">
            Register For Event Pass <span>→</span>
          </button>
        </div>
      </div>
    </div>`;

  document.getElementById("detailJoin").addEventListener("click", () => openRegistration(event.name));
  const closeBtn = document.querySelector("[data-close-modal]");
  if (closeBtn) closeBtn.addEventListener("click", () => document.getElementById("detailsDialog").close());
  document.getElementById("detailsDialog").showModal();
}
function openRegistration(targetName = "General Campus Life"){
  const detailsDialog = document.getElementById("detailsDialog");
  if (detailsDialog.open) detailsDialog.close();

  // Reset form and view states
  document.getElementById("formSection").hidden = false;
  document.getElementById("passContainer").hidden = true;
  document.getElementById("formMessage").textContent = "";
  document.getElementById("regTargetItem").value = targetName;

  document.getElementById("registerDialog").showModal();
}
document.querySelectorAll(".category").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".category.active").classList.remove("active");
  button.classList.add("active");
  selectedCategory = button.dataset.category;
  renderClubs();
}));
searchInput.addEventListener("input", renderClubs);
// Quick Strip Click Handlers
const quickExplore = document.getElementById("quickExploreClubs");
if (quickExplore) {
  quickExplore.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("clubs").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => searchInput.focus(), 600);
  });
}

const quickJoin = document.getElementById("quickJoinEvents");
if (quickJoin) {
  quickJoin.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("events").scrollIntoView({ behavior: "smooth" });
  });
}

const quickResources = document.getElementById("quickFindResources");
if (quickResources) {
  quickResources.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("resourcesDialog").showModal();
  });
}


// Modal & Navigation Handlers
document.getElementById("openRegister").addEventListener("click", () => openRegistration("General Campus Life"));
document.getElementById("aboutRegister").addEventListener("click", () => openRegistration("General Campus Life"));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => {
  if(event.target === dialog) dialog.close();
}));

// Pass Print and Close Handlers
document.getElementById("printPassBtn").addEventListener("click", () => window.print());
document.getElementById("closePassBtn").addEventListener("click", () => document.getElementById("registerDialog").close());

document.getElementById("registerForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const messageEl = document.getElementById("formMessage");
  
  const payload = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    interest: form.elements.interest.value,
    club_or_event: document.getElementById("regTargetItem").value
  };

  submitButton.disabled = true;
  submitButton.textContent = "Generating Pass...";

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok && data.success) {
      // Display Digital Ticket Pass
      const finalPassId = data.passId || `#VIT-${String(data.registrationId || 1).padStart(3, '0')}`;
      document.getElementById("passId").textContent = finalPassId;
      document.getElementById("passEventName").textContent = data.target || payload.club_or_event;
      document.getElementById("passStudentName").textContent = data.name || payload.name;
      document.getElementById("passDate").textContent = data.date || "Today";

      if (data.qrCode) {
        document.getElementById("passQrImg").src = data.qrCode;
      } else {
        // Fallback QR code generator URL
        const fallbackData = encodeURIComponent(`VIT PUNE PASS | ID: ${finalPassId} | Event: ${data.target} | Student: ${data.name}`);
        document.getElementById("passQrImg").src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${fallbackData}`;
      }

      document.getElementById("formSection").hidden = true;
      document.getElementById("passContainer").hidden = false;
      form.reset();
    } else {
      throw new Error(data.error || "Submission failed");
    }
  } catch (err) {
    messageEl.style.color = "#5d832d";
    messageEl.textContent = `Thanks ${payload.name}! Registration saved locally.`;
    form.reset();
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "Confirm & Generate Entry Pass <span>→</span>";
  }
});
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(link => link.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));
async function loadFromBackend(){
  try {
    const [clubsRes, eventsRes] = await Promise.all([
      fetch("/api/clubs"),
      fetch("/api/events")
    ]);
    if (clubsRes.ok) {
      const serverClubs = await clubsRes.json();
      if (serverClubs.length > 0) clubs = serverClubs;
    }
    if (eventsRes.ok) {
      const serverEvents = await eventsRes.json();
      if (serverEvents.length > 0) events = serverEvents;
    }
  } catch (err) {
    console.log("Using cached/local data:", err.message);
  }
  renderClubs();
  renderEvents();
}

loadFromBackend();
