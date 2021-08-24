const express = require('express');
const app = express();
app.use(express.json());

app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.json(notes);
});

app.get('/info', (req, res) => {
    res.write(`<p>Phonebook has info for ${notes.length} people</p>`);
    res.write(`<p>${new Date()}</p>`);
    res.send();
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id == id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send('Not found');
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id == id);
    if (note) {
        notes.splice(notes.indexOf(note), 1);
        res.status(204).json(note);
    } else {
        res.status(404).send('Not found');
    }
});

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.send({ error: 'The name or number is missing' });
    } 
    const alreadyPresent = notes.find(note => note.name === name);
    if (alreadyPresent) {
        return res.send({ error: 'Name is already present' });
    }
    const note = { 
        "id": Math.floor(Math.random()*1000),
        "name": name, 
        "number": number
    };
    notes = notes.concat(note);
    res.send(note);
});