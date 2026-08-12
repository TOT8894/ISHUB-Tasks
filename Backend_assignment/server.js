const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

const users = [];

const items = [
  {
    id: 'item_1',
    name: 'Vintage Watch',
    price: 150,
    sellerId: 'admin',
    isSold: false
  },
  {
    id: 'item_2',
    name: 'Wireless Headphones',
    price: 80,
    sellerId: 'admin',
    isSold: false
  }
];

const dummyAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(401).json({
      message: 'Invalid user'
    });
  }

  req.user = user;

  next();
};

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  const existingUser = users.find(
    (user) => user.username === username
  );

  if (existingUser) {
    return res.status(400).json({
      message: 'Username already exists'
    });
  }

  const newUser = {
    id: `user_${users.length + 1}`,
    username,
    password,
    balance: 0
  };

  users.push(newUser);

  return res.status(201).json({
    user: {
      id: newUser.id,
      username: newUser.username,
      balance: newUser.balance
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) =>
      user.username === username &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  return res.status(200).json({
    userId: user.id
  });
});

app.post('/api/deposit', dummyAuth, (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== 'number') {
    return res.status(400).json({
      message: 'Amount must be a number'
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: 'Amount must be greater than 0'
    });
  }

  req.user.balance += amount;

  return res.status(200).json({
    newBalance: req.user.balance
  });
});

app.get('/api/items', (req, res) => {
  const availableItems = items.filter(
    (item) => item.isSold === false
  );

  return res.status(200).json({
    items: availableItems
  });
});

app.post('/api/items/sell', dummyAuth, (req, res) => {
  const { name, price } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Item name is required'
    });
  }

  if (typeof price !== 'number') {
    return res.status(400).json({
      message: 'Price must be a number'
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      message: 'Price must be greater than 0'
    });
  }

  const newItem = {
    id: `item_${items.length + 1}`,
    name,
    price,
    sellerId: req.user.id,
    isSold: false
  };

  items.push(newItem);

  return res.status(201).json({
    item: newItem
  });
});

app.post('/api/items/buy/:id', dummyAuth, (req, res) => {
  const itemId = req.params.id;

  const item = items.find(
    (item) => item.id === itemId
  );

  if (!item) {
    return res.status(404).json({
      message: 'Item not found'
    });
  }

  if (item.isSold) {
    return res.status(400).json({
      message: 'Item has already been sold'
    });
  }

  if (item.sellerId === req.user.id) {
    return res.status(400).json({
      message: 'You cannot buy your own item'
    });
  }

  if (req.user.balance < item.price) {
    return res.status(400).json({
      message: 'Insufficient balance'
    });
  }

  const seller = users.find(
    (user) => user.id === item.sellerId
  );

  if (!seller) {
    return res.status(400).json({
      message: 'Seller not found'
    });
  }

  req.user.balance -= item.price;

  seller.balance += item.price;

  item.isSold = true;

  return res.status(200).json({
    remainingBalance: req.user.balance,
    item
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;