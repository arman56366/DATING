// Vercel Serverless Function Handler with Real Logic
// In-memory database (will reset on redeploy)
let users = [
  { id: 1, name: 'Demo User', age: 25, gender: 'male', bio: 'Demo bio', username: 'demouser', photos: [], isPremium: false, createdAt: Date.now() },
  { id: 2, name: 'Alice', age: 23, gender: 'female', bio: 'Love travel', username: 'alice_love', photo: 'https://via.placeholder.com/400x500?text=Alice', isPremium: false, createdAt: Date.now() },
  { id: 3, name: 'Emma', age: 24, gender: 'female', bio: 'Coffee lover', username: 'emma_coffee', photo: 'https://via.placeholder.com/400x500?text=Emma', isPremium: false, createdAt: Date.now() },
  { id: 4, name: 'Sophia', age: 22, gender: 'female', bio: 'Artist', username: 'sophia_art', photo: 'https://via.placeholder.com/400x500?text=Sophia', isPremium: false, createdAt: Date.now() },
];

let matches = []; // { userId: 1, matchId: 2, createdAt: ... }
let likes = []; // { userId: 1, likeId: 2, createdAt: ... }
let dislikes = []; // { userId: 1, dislikeId: 2, createdAt: ... }
let tokens = {}; // { 'token': userId }
let userSessions = {}; // { 'checkValue': userId }

const generateToken = (userId) => {
  const token = 'token_' + userId + '_' + Date.now();
  tokens[token] = userId;
  return token;
};

const getUserFromToken = (token) => {
  return tokens[token] ? users.find(u => u.id === tokens[token]) : null;
};

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse JSON body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      if (body) req.body = JSON.parse(body);
    } catch (e) {
      req.body = {};
    }

    const path = req.url.split('?')[0].replace('/api', '');
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Health check
    if (path === '/health') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ status: 'ok' });
      return;
    }

    // Login
    if (path === '/login' && req.method === 'POST') {
      const user = users[0]; // Demo user
      const token = generateToken(user.id);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: { id: user.id, name: user.name, age: user.age, gender: user.gender, bio: user.bio, isPremium: user.isPremium },
        token: token
      });
      return;
    }

    // Register
    if (path === '/register' && req.method === 'POST') {
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      const newUser = {
        id: newId,
        name: req.body.name || 'New User',
        age: req.body.age || 25,
        gender: req.body.gender_id || 'male',
        bio: req.body.bio || '',
        username: req.body.username || `user_${newId}`,
        photo: 'https://via.placeholder.com/400x500?text=User',
        isPremium: false,
        createdAt: Date.now()
      };
      users.push(newUser);
      const token = generateToken(newId);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: newUser,
        token: token
      });
      return;
    }

    // Get Profile
    if (path === '/profile' && req.method === 'GET') {
      const user = getUserFromToken(token);
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: user
      });
      return;
    }

    // Update Profile (PATCH)
    if (path === '/profile' && req.method === 'PATCH') {
      const user = getUserFromToken(token);
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      user.name = req.body.name || user.name;
      user.age = req.body.age || user.age;
      user.bio = req.body.bio || user.bio;
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: user,
        message: 'Profile updated successfully'
      });
      return;
    }

    // Fetch Users (excluding self and already matched/liked/disliked)
    if (path === '/fetch-users' && req.method === 'GET') {
      const currentUser = getUserFromToken(token);
      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const page = new URL(`http://localhost${req.url}`).searchParams.get('page') || 1;
      const likedIds = likes.filter(l => l.userId === currentUser.id).map(l => l.likeId);
      const dislikedIds = dislikes.filter(l => l.userId === currentUser.id).map(l => l.dislikeId);
      const matchedIds = matches.filter(m => m.userId === currentUser.id).map(m => m.matchId);
      
      const availableUsers = users.filter(u => 
        u.id !== currentUser.id && 
        !likedIds.includes(u.id) && 
        !dislikedIds.includes(u.id) &&
        !matchedIds.includes(u.id)
      );
      
      const USERS_PER_PAGE = 6;
      const start = (page - 1) * USERS_PER_PAGE;
      const paginatedUsers = availableUsers.slice(start, start + USERS_PER_PAGE);
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        users: paginatedUsers,
        has_next_page: availableUsers.length > start + USERS_PER_PAGE
      });
      return;
    }

    // Like User
    if (path === '/like' && req.method === 'POST') {
      const currentUser = getUserFromToken(token);
      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const likeId = req.body.user_id;
      const otherUser = users.find(u => u.id === likeId);
      if (!otherUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      // Check if other user already liked current user
      const isMatch = likes.some(l => l.userId === likeId && l.likeId === currentUser.id);
      
      // Add like
      if (!likes.some(l => l.userId === currentUser.id && l.likeId === likeId)) {
        likes.push({ userId: currentUser.id, likeId: likeId, createdAt: Date.now() });
      }
      
      // If mutual, add match
      if (isMatch && !matches.some(m => (m.userId === currentUser.id && m.matchId === likeId) || (m.userId === likeId && m.matchId === currentUser.id))) {
        matches.push({ userId: currentUser.id, matchId: likeId, createdAt: Date.now() });
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        match: isMatch,
        message: isMatch ? 'It\'s a match!' : 'Like registered'
      });
      return;
    }

    // Dislike User
    if (path === '/dislike' && req.method === 'POST') {
      const currentUser = getUserFromToken(token);
      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const dislikeId = req.body.user_id;
      if (!likes.some(l => l.userId === currentUser.id && l.likeId === dislikeId)) {
        dislikes.push({ userId: currentUser.id, dislikeId: dislikeId, createdAt: Date.now() });
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        message: 'Dislike registered'
      });
      return;
    }

    // Get Matches
    if (path === '/matches' && req.method === 'GET') {
      const currentUser = getUserFromToken(token);
      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const userMatches = matches
        .filter(m => m.userId === currentUser.id || m.matchId === currentUser.id)
        .map(m => {
          const matchedUserId = m.userId === currentUser.id ? m.matchId : m.userId;
          return users.find(u => u.id === matchedUserId);
        });
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        matches: userMatches
      });
      return;
    }

    // Unmatch
    if (path === '/unmatch' && req.method === 'POST') {
      const currentUser = getUserFromToken(token);
      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const matchId = req.body.match_id;
      matches = matches.filter(m => !(
        (m.userId === currentUser.id && m.matchId === matchId) ||
        (m.userId === matchId && m.matchId === currentUser.id)
      ));
      
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        message: 'User unmatched successfully'
      });
      return;
    }

    // Generate Invoice (Payment)
    if (path === '/generate-invoice' && req.method === 'POST') {
      const currentUser = getUserFromToken(token);
      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      currentUser.isPremium = true;
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        payment_url: 'https://stripe.com/invoice/demo',
        message: 'Now you are Pro!'
      });
      return;
    }

    // 404 Not Found
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({ error: 'Not found' });
  });
};
