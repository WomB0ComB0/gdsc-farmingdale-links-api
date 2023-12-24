import { Router, Response, Request } from 'express';
import { readEventsFromFile } from '../controllers/fileHandler';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  console.log('Requested upcoming events');
  try {
    const data = readEventsFromFile('../data/upcoming-events.js');
    res.json(data);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
