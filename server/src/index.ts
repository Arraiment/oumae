import express from 'express';
import { Request, Response } from 'express';
import { fetchDetails, fetchSuggestions } from './queries';
import { Media, MediaType } from './sources/models';

const app = express();
const PORT = process.env.PORT || 8080

app.use(express.json())

app.get('/api/search', (req: Request, res: Response) => {
  const { q, type } = req.query
  const mediaTypes = ['anime', 'manga', 'novel']

  if (typeof q === 'string') {
    // Checks if query value of "type" is valid MediaType
    if (mediaTypes.some(t => type === t)) {
      const mediaType = type as MediaType
      // Query should already be uri encoded on the client-side
      fetchSuggestions(q, mediaType).then(results => {
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

app.post('/api/details', (req: Request, res: Response) => {
  console.log(req.body)
  const media: Media = req.body
  fetchDetails(media).then(results => {
    res.status(200).json(results)
  }).catch(error => 
    res.status(500).send(`Failed to fetch media\n${error}`)
  )
})

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`);
});