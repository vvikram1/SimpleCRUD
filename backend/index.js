const { Pool } = require('pg');
const cors = require('cors');

// Create a new Pool instance with connection details
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Create a table 'users' if not exists
pool.query(
  `CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL
  );`,
  (err, res) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Table "users" created successfully');
    }
  }
);

// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
const corsOptions = {
  origin: '*', // Allow requests from this origin
  methods: 'GET,POST', // Allow specified HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allow specified headers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Validate email format
function validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}
  
// Validate phone number format
function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

// POST endpoint to add a new user
app.post('/users', async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    // Insert user data into the 'users' table
    if (!validatePhone(phone)) {
        return res.status(400).send('Invalid phone number format');
    }
    
    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email format');
    }
    
    const result = await pool.query(
      'INSERT INTO public.users (name, phone, email) VALUES ($1, $2, $3) RETURNING id',
      [name, phone, email]
    );
    res.status(201).send(`User added with ID: ${result.rows[0].id}`);
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).send('Error inserting user');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
