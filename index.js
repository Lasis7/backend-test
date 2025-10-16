require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.static('dist'));
app.use(express.json());
const morgan = require('morgan');
const Contact = require('./models/contact');

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :data',
    {
      skip: function (req, res) {
        return req.method !== 'POST' || res.statusCode >= 400;
      },
    }
  )
);

// let people = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: '1',
//   },
//   {
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//     id: '2',
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: '3',
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: '4',
//   },
// ];

app.get('/api/persons', (request, response, next) => {
  Contact.find({})
    .then((contacts) => {
      response.json(contacts);
    })
    .catch((err) => next(err));
});

app.get('/info', (request, response) => {
  Contact.countDocuments({}).then((count) => {
    response.send(`<div>Phonebook has info for ${count}
     people</div> <div>${new Date()}</div>`);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/api/persons', (request, response, next) => {
  const person = request.body;
  if (!person.name || !person.number) {
    const missingFields = [];
    if (!person.name) missingFields.push('name');
    if (!person.number) missingFields.push('number');
    const error = new Error(`${missingFields.join(' and ')} missing`);
    error.name = 'ValidationError';
    return next(error);
  }

  const contact = new Contact({
    name: person.name,
    number: person.number,
  });
  contact
    .save()
    .then((savedContact) => {
      response.status(201).json(savedContact);
    })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true }
  )
    .then((updatedContact) => {
      if (updatedContact) {
        response.json(updatedContact);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  response.status(500).json({ error: 'internal server error' });
};

app.use(errorHandler);

// const checkNames = (name) => {
//   const normalizedName = name.trim().toLowerCase();
//   return people.some(
//     (object) => object.name.trim().toLowerCase() === normalizedName
//   );
// };

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
