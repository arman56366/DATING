// Vercel Serverless Function Handler
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

    // Remove /api prefix from path
    const path = req.url.split('?')[0].replace('/api', '');

    // Health check
    if (path === '/health') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ status: 'ok' });
      return;
    }

    // Login
    if (path === '/login' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: {
          id: 1,
          name: 'Demo User',
          age: 25,
          gender: 'male',
          bio: 'Demo bio',
          isPremium: false
        },
        token: 'demo-token'
      });
      return;
    }

    // Profile GET
    if (path === '/profile' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: {
          id: 1,
          name: 'Demo User',
          age: 25,
          gender: { id: 1, name: 'Male' },
          bio: 'Demo bio',
          photo: 'https://via.placeholder.com/400x500?text=Demo+User',
          isPremium: false,
          username: 'demouser'
        }
      });
      return;
    }

    // Fetch Users
    if (path === '/fetch-users' && req.method === 'GET') {
      const page = new URL(`http://localhost${req.url}`).searchParams.get('page') || 1;
      const users = [
        {
          id: 2, name: 'Alice', age: 23, gender: 'female', bio: 'Love travel',
          photo: 'https://via.placeholder.com/400x500?text=Alice'
        },
        {
          id: 3, name: 'Emma', age: 24, gender: 'female', bio: 'Coffee lover',
          photo: 'https://via.placeholder.com/400x500?text=Emma'
        },
        {
          id: 4, name: 'Sophia', age: 22, gender: 'female', bio: 'Artist',
          photo: 'https://via.placeholder.com/400x500?text=Sophia'
        },
        {
          id: 5, name: 'Lena', age: 25, gender: 'female', bio: 'Fitness enthusiast',
          photo: 'https://via.placeholder.com/400x500?text=Lena'
        },
        {
          id: 6, name: 'Mia', age: 21, gender: 'female', bio: 'Music fan',
          photo: 'https://via.placeholder.com/400x500?text=Mia'
        },
        {
          id: 7, name: 'Nina', age: 26, gender: 'female', bio: 'Book reader',
          photo: 'https://via.placeholder.com/400x500?text=Nina'
        }
      ];
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        users: users,
        has_next_page: page < 3
      });
      return;
    }

    // Matches
    if (path === '/matches' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        matches: [
          {
            id: 2, name: 'Alice', age: 23, gender: 'female', bio: 'Love travel',
            photo: 'https://via.placeholder.com/400x500?text=Alice',
            username: 'alice_love'
          }
        ]
      });
      return;
    }

    // Like
    if (path === '/like' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        match: Math.random() > 0.5,
        message: 'Like registered'
      });
      return;
    }

    // Dislike
    if (path === '/dislike' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        message: 'Dislike registered'
      });
      return;
    }

    // Register
    if (path === '/register' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: {
          id: 1,
          name: req.body.name || 'New User',
          age: req.body.age || 25,
          gender: req.body.gender_id || 'male',
          bio: req.body.bio || '',
          isPremium: false
        },
        token: 'demo-token-' + Date.now()
      });
      return;
    }

    // Update Profile (PATCH)
    if (path === '/profile' && req.method === 'PATCH') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        user: {
          id: 1,
          name: req.body.name || 'Demo User',
          age: req.body.age || 25,
          gender: { id: 1, name: 'Male' },
          bio: req.body.bio || 'Demo bio',
          photo: 'https://via.placeholder.com/400x500?text=Demo+User',
          isPremium: false,
          username: 'demouser'
        },
        message: 'Profile updated successfully'
      });
      return;
    }

    // Unmatch
    if (path === '/unmatch' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        message: 'User unmatched successfully'
      });
      return;
    }

    // Generate Invoice
    if (path === '/generate-invoice' && req.method === 'POST') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        success: true,
        payment_url: 'https://stripe.com/invoice/demo',
        message: 'Invoice generated'
      });
      return;
    }

    // 404 Not Found
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({ error: 'Not found' });
  });
};
