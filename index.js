import express from 'express';
import { connect, Schema, model } from 'mongoose';
import bodyParser from 'body-parser'; // Change here
import cors from 'cors';

// Initialize Express
const app = express();
app.use(bodyParser.json()); // Change here
app.use(cors());

app.get('/',(req,res)=>{
  res.send('api running successfully');
})

// MongoDB connection
connect('mongodb://localhost:27017/noormohammed', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model('User', UserSchema);

// Registration route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!email.endsWith('@mountzion.ac.in')) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Create a new user
    const newUser = new User({ email, password }); // Corrected the constructor
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate username or email
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
