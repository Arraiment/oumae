import express from 'express';
import { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 8080

app.get('/api', (req: Request, res: Response) => {
  res.send('Application works!');
});

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});