// Minimal Express backend for Vercel serverless
const express = require('express');
const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Заглушка для логина
app.post('/login', (req, res) => {
  res.json({
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
});

// Заглушка для профиля
app.get('/profile', (req, res) => {
  res.json({
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
});

// Заглушка для получения пользователей
app.get('/fetch-users', (req, res) => {
  const page = req.query.page || 1;
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
  res.json({
    success: true,
    users: users,
    has_next_page: page < 3
  });
});

// Заглушка для матчей
app.get('/matches', (req, res) => {
  res.json({
    success: true,
    matches: [
      {
        id: 2, name: 'Alice', age: 23, gender: 'female', bio: 'Love travel',
        photo: 'https://via.placeholder.com/400x500?text=Alice',
        username: 'alice_love'
      }
    ]
  });
});

// Заглушка для unmatch
app.post('/unmatch', (req, res) => {
  res.json({
    success: true,
    message: 'User unmatched successfully'
  });
});

// Заглушка для like
app.post('/like', (req, res) => {
  res.json({
    success: true,
    match: Math.random() > 0.5,
    message: 'Like registered'
  });
});

// Заглушка для dislike
app.post('/dislike', (req, res) => {
  res.json({
    success: true,
    message: 'Dislike registered'
  });
});

// Заглушка для регистрации
app.post('/register', (req, res) => {
  res.json({
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
});

// Заглушка для обновления профиля (PATCH)
app.patch('/profile', (req, res) => {
  res.json({
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
});

// Заглушка для оплаты
app.post('/generate-invoice', (req, res) => {
  res.json({
    success: true,
    payment_url: 'https://stripe.com/invoice/demo',
    message: 'Invoice generated'
  });
});

module.exports = app;
