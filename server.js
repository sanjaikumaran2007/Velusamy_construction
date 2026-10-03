/**
 * Velusamy Construction Pvt Ltd — dynamic Express server
 * ---------------------------------------------------------------
 * Renders the single-page site through EJS (so data like the
 * copyright year, phone number, and trust stats live in one place
 * on the server) and exposes a small JSON API for the contact form.
 */

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- View engine -------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Security & parsing middleware --------------------------------
app.use(
  helmet({
    contentSecurityPolicy: false // relaxed here since the demo loads self-hosted fonts/video; tighten for production
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Basic abuse protection on the contact endpoint
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, error: 'Too many requests. Please try again later.' }
});

// ---- Site data (edit here to update content site-wide) -----------
const siteData = {
  company: 'Velusamy Construction Pvt Ltd',
  founder: 'Velusamy',
  phone: '6385221024',
  phoneDisplay: '+91 63852 21024',
  email: 'velusamyconstructionpvt@gmail.com',
  instagramHandle: 'velusamy_construction_pvt',
  instagramUrl: 'https://instagram.com/velusamy_construction_pvt',
  year: new Date().getFullYear(),
  stats: [
    { value: '120+', label: 'Projects Delivered' },
    { value: '15+', label: 'Years in Structural Engineering' },
    { value: '38', label: 'Cantilever & Anti-Gravity Builds' },
    { value: '100%', label: 'ISO-Certified Safety Record' }
  ]
};

// ---- Routes ---------------------------------------------------------
app.get('/', (req, res) => {
  res.render('index', { site: siteData });
});

app.use('/api/contact', contactLimiter, contactRouter);

// ---- 404 -------------------------------------------------------------
app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Velusamy Construction site running at http://localhost:${PORT}`);
});
