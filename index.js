const express = require('express');
const app = express();
app.use(express.json());
const morgan = require('morgan');

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.static('dist'));

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :data',
    {
      skip: function (req, res) {
        return res.statusCode >= 400;
      },
    }
  )
);

let people = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: '1',
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: '2',
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: '3',
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: '4',
  },
];

app.get('/api/persons', (request, response) => {
  response.json(people);
});

app.get('/info', (request, response) => {
  response.send(
    `<div>Phonebook has info for ${people.length}
     people</div> <div>${new Date()}</div>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = people.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  people = people.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const randomId = Math.floor(Math.random() * 1000) + 1;

  const person = request.body;
  if (!person.name && !person.number) {
    return response.status(400).json({
      error: 'information is missing: name, number',
    });
  } else if (!person.name || !person.number) {
    const errorMessage = !person.name ? 'name' : 'number';
    return response.status(400).json({
      error: `${errorMessage} is missing`,
    });
  } else if (checkNames(person.name)) {
    return response.status(400).json({
      error: 'person is already in the phonebook',
    });
  } else {
    person.id = randomId;
    people = people.concat(person);
    response.json(person);
  }
});

const checkNames = (name) => {
  const normalizedName = name.trim().toLowerCase();
  return people.some(
    (object) => object.name.trim().toLowerCase() === normalizedName
  );
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
