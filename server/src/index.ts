import express from 'express';
import { Request, Response } from 'express';
import compression from 'compression';
import path from 'path';

import { fetchDetails, fetchSuggestions } from './queries';
import { Media, MediaType } from './sources/models';

const app = express();
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(compression())

if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, 'public')))
  app.get('*', (_req, res) => res.sendFile(__dirname, '/public/index.html'))
}

app.get('/api/search', (req: Request, res: Response) => {
  const { q, type } = req.query

  if (typeof q === 'string') {
    // Checks if query value of "type" is valid MediaType
    if (type === 'anime' || type === 'manga') {
      const mediaType: MediaType = type
      // Query should already be uri encoded on the client-side
      fetchSuggestions(q, mediaType)
        .then(results => res.status(200).json(results))
        .catch(error => res.status(500).send(`Failed to fetch suggestions\n${error}`))
    } else {
      res.status(400).send('Invalid media type')
    }
  } else {
    res.status(400).send('Invalid query format')
  }
})

app.post('/api/details', (req: Request, res: Response) => {
  const media: Media = req.body
  fetchDetails(media)
    .then(results => res.status(200).json(results))
    .catch(error => res.status(500).send(`Failed to fetch media\n${error}`))
})

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});