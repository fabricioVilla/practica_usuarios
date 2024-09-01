// server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
const app = express();
const port = process.env.PORT || 8080;
import  router  from './routes/index.js';

app.use(cors({
    origin: '*' // Reemplaza con el dominio permitido
}));
// Middleware para parsear JSON
app.use(express.json());

app.use('/api', router);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
