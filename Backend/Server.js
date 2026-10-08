
// External Module
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const http = require('http')
const cookieParser = require('cookie-parser');
// Local Module
const connectDB = require('./config/db');
const redis = require('./config/redis');
const authRoutes = require('./routes/auth.route');



const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'KanbanAI API running 🚀' });
});

// error middleware 

app.use((req, res) => {                    
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {          
  console.log(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

connectDB()
    .then(() => {
        server.listen(process.env.PORT || 3000, () => {
            console.log(
                `Server running at http://localhost:${process.env.PORT || 3000}`
            );
        });
    })
    .catch((error) => {
        console.error(`Failed to connect to MongoDB: ${error.message}`);
    });