import express from 'express';
import cors from 'cors';
import { cwd } from 'process';
import ConnectDB from './src/config/db.js';
import mongoSanitize from 'express-mongo-sanitize';
import { dashboardRoutes } from './src/routes/dashboard/dashboardRoutes/dashboardRoutes.js';
import { frontendRoutes } from './src/routes/frontend/frontendRoutes/frontendRoutes.js';
import { createAdmin } from './src/utils/createAdmin.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

const port = process.env.PORT_NUMBER;

app.get('/data', (req,response) => {  
  response.json({
    success :true,
    message : 'server is running'

  });
});


app.use('/api/dashboard',dashboardRoutes);
app.use('/api/frontend',frontendRoutes);
app.use('/uploads', express.static(cwd() + '/uploads', {maxAge:31557600}));


ConnectDB();
app.listen(port, async () => {
  await createAdmin();
  console.log(`Server Listening to port Number ${port}`);
});
