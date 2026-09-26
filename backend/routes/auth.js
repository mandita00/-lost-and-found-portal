const router = require('express').Router();
const passport = require('passport');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_URL + '/login',
  }),
  (req, res) => res.redirect(process.env.CLIENT_URL + '/')
);

router.get('/me', (req, res) => {
  res.set('Cache-Control', 'no-store');
  if (req.isAuthenticated()) return res.json(req.user);
  res.status(401).json({ error: 'Not logged in' });
});

router.post('/logout', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/logout', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  req.logout(() => res.redirect(process.env.CLIENT_URL));
});

module.exports = router;