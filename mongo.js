const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Provide password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ae8656:${password}@cluster0.fdzph56.mongodb.net/contactApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];
  const contact = new Contact({
    name: name,
    number: number,
  });

  contact.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
