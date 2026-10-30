const express = require('express');
const cors = require('cors');
const path = require('path');
const QRCode = require('qrcode');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname)));

// --- RESTful API Routes ---

// 1. Get all clubs
app.get('/api/clubs', (req, res) => {
  try {
    const clubs = db.getClubs();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve clubs from database' });
  }
});

// 2. Get all events
app.get('/api/events', (req, res) => {
  try {
    const events = db.getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve events from database' });
  }
});

// 3. Register a student for a club/event
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, interest, club_or_event } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Please provide name and college email.' });
    }

    const chosenInterest = interest || 'Campus Life';
    const chosenTarget = club_or_event || 'General Campus Interest';

    const result = db.saveRegistration({
      name,
      email,
      interest: chosenInterest,
      club_or_event: chosenTarget
    });

    const passId = `#VIT-${String(result.id).padStart(3, '0')}`;
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Generate real, scannable QR Code containing verified pass information
    const qrPayload = `----------------------------
VIT PUNE · VERIFIED ENTRY PASS
Pass ID: ${passId}
Event / Club: ${chosenTarget}
Attendee: ${name}
Email: ${email}
Issued Date: ${dateStr}
Status: CONFIRMED ENTRY
Venue: VIT Pune Campus, Bibwewadi
----------------------------`;

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 220,
      margin: 1,
      color: {
        dark: '#172b27',
        light: '#ffffff'
      }
    });

    res.status(201).json({
      success: true,
      message: `Registration confirmed for ${chosenTarget}!`,
      registrationId: result.id,
      passId,
      name,
      target: chosenTarget,
      date: dateStr,
      qrCode: qrCodeDataUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error saving registration' });
  }
});

// 4. Admin: View all registrations
app.get('/api/registrations', (req, res) => {
  try {
    const registrations = db.getRegistrations();
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// 5. Admin: Delete a registration
app.delete('/api/registrations/:id', (req, res) => {
  try {
    db.deleteRegistration(req.params.id);
    res.json({ success: true, message: 'Registration deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

// 6. Admin: Add a new event
app.post('/api/events', (req, res) => {
  try {
    const { day, month, name, description, type, time, category, emoji } = req.body;
    if (!day || !month || !name || !type || !time || !category) {
      return res.status(400).json({ error: 'Please fill all required event fields.' });
    }

    const result = db.addEvent({ day, month, name, description, type, time, category, emoji });
    res.status(201).json({ success: true, id: result.id, message: 'Event added successfully to VIT Pune calendar!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add event to database' });
  }
});

// 7. Admin: Delete an event
app.delete('/api/events/:id', (req, res) => {
  try {
    db.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event removed from calendar' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎓 CampusConnect (VIT Pune) Backend Server Running`);
  console.log(`🌐 Web App:   http://localhost:${PORT}`);
  console.log(`🛡️ Admin View: http://localhost:${PORT}/admin.html`);
  console.log(`📁 Database:   campus.db (SQLite)`);
  console.log(`===============================================`);
});
