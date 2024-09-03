import express, { Request, Response } from 'express';
import { prisma } from './prisma';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 8081;
const items = [];

// In-memory notes array
const notes: { title: string; description: string; createdAt: Date }[] = [];

// API endpoint to create a new note
app.post('/notes', async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }
  const note = await prisma.notes.create({
    data: {
      title: title,
      description: description,
    },
  });
  // const newNote = {
  //   title,
  //   description,
  //   createdAt: new Date(),
  // };

  // notes.push(newNote);

  return res.status(201).json(note);
});

app.get('/notes', async (req: Request, res: Response) => {
  const notes = await prisma.notes.findMany();
  return res.status(200).json(notes);
});

app.get('/health', async (req, res) => {
  const version = await prisma.$queryRaw`SELECT version()`;
  res.json({ status: 'OK', version });
});
// app.get('/', (req, res) => {
//   res.send(items);
// });

// app.post('/', (req, res) => {
//   const data = req.body;
//   console.log(data);
//   items.push(data);
//   res.status(201).json(data);
//   //res.send('This is a post request');
// });

// app.get('/data', (req, res) => {
//   res.status(500).json('no data found');
// });

// app.get('/data/:id', (req, res) => {
//   res.status(200).json(req.params.id);
// });

// app.get('/data/:id/count', (req, res) => {
//   res.status(200).json('hello');
// });

app.put('/notes/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const notes_updated = await prisma.notes.update({
    where: { id: parseInt(id, 10) },
    data: { title, description },
  });

  return res.status(200).json(notes_updated);
});

app.delete('/notes/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.notes.delete({ where: { id: parseInt(id, 10) } });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: 'Note not found.' });
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
