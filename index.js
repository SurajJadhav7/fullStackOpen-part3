const express = require('express');
const app = express();
app.use(express.json());

const morgan = require('morgan');
morgan.token('body', function (req, res) { return req.method=='POST' ? JSON.stringify(req.body) : null; })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Middleware
const unknownEndpoint = (req, res) => {
    res.status(404).send({ 
        error: 'Unknown endpoint' 
    });
}
// app.use(unknownEndpoint);

// Listener
app.listen(3001, () => {
    console.log('Example app listening on port 3001!');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

let phonebook = [
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
    res.json(phonebook);
});

app.get('/info', (req, res) => {
    res.write(`<p>Phonebook has info for ${phonebook.length} people</p>`);
    res.write(`<p>${new Date()}</p>`);
    res.send();
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const note = phonebook.find(note => note.id == id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send('Not found');
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const note = phonebook.find(note => note.id == id);
    if (note) {
        phonebook.splice(phonebook.indexOf(note), 1);
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
    const alreadyPresent = phonebook.find(note => note.name === name);
    if (alreadyPresent) {
        return res.send({ error: 'Name is already present' });
    }
    const note = { 
        "id": Math.floor(Math.random()*1000),
        "name": name, 
        "number": number
    };
    phonebook = phonebook.concat(note);
    res.send(note);
});