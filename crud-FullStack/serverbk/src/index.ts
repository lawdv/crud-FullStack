import express from 'express';
import crudRoutes from './routes/crudRoutes';
import cors from 'cors';


const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,               
}));

app.use(express.json());
app.use('/api/notas', crudRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));