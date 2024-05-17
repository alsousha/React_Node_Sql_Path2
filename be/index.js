import express from 'express';
import userRoutes from './routes/user.js'
import cors from 'cors';

const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use('/api', userRoutes);

app.listen(8801, () => {
  console.log('Connected');
});
