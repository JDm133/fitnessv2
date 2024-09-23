const express = require('express');
const connectDB = require('./config/connectDB');
const authRoutes = require('./routes/auth');
const cors = require('cors'); // Importowanie pakietu cors

const app = express();
const workoutRoutes = require('./routes/workouts');
app.use('/workouts', workoutRoutes);
// Używanie CORS
app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);

connectDB();

app.listen(5000, () => {
    console.log(`Serwer działa na porcie ${process.env.PORT || 5000}`);
});
