
// External Module
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http')
// Local Module
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.route');

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'KanbanAI API running 🚀' });
});

// error middleware 

app.use((err,req,res,next) => { 
    console.log(err.stack);
    res.status(500).json({message: "Internal Server Error"});

});

app.use((req,res) => {
    res.status(404).json({
        message : "Not Found",
    });
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