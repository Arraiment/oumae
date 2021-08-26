import express from 'express';
import { Request, Response } from 'express';
import { fetchSuggestions } from './queries';

const app = express();
const PORT = process.env.PORT || 8080

app.get('/api/search', (req: Request, res: Response) => {
  const { q, type } = req.query

  if (typeof q === 'string') {
    if (type === 'anime' || type === 'manga') {

      // Query should already be uri encoded on the client-side
      fetchSuggestions(q, type).then(results => {
        res.status(200).json(results)
      }).catch(error => {
        res.status(500).send(`Failed to fetch suggestions\n${error}`)
      })

    } else {
      res.status(400).send('Invalid media type')
    }
  } else {
    res.status(400).send('Invalid query type')
  }
})

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});