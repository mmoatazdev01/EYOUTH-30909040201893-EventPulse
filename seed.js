const mongoose = require('mongoose');
const dns = require('dns');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Message = require('./models/Message');

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is required in .env');
    }

    await mongoose.connect(mongoUri);

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
      Message.deleteMany({})
    ]);

    const adminPassword = await bcrypt.hash('@dmin231@decieyouth', 12);

    const admin = await User.create({
      name: 'Admin123',
      email: 'Admin321@gmail.com',
      password: adminPassword,
      role: 'admin'
    });

    const categories = await Category.insertMany([
      { name: 'Tech & Development', description: 'Technology and software events.' },
      { name: 'Music & Arts', description: 'Creative and artistic gatherings.' },
      { name: 'Business & Startups', description: 'Networking and entrepreneurship events.' },
      { name: 'Sports & Wellness', description: 'Fitness and healthy lifestyle events.' }
    ]);

    const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category._id]));

    const sampleEvents = [
      {
        title: 'Cairo Tech Summit 2026',
        description: 'A technology-focused event bringing together software builders and investors.',
        category: categoryMap['Tech & Development'],
        date: '2026-02-14T18:00:00.000Z',
        city: 'Cairo',
        venue: 'The GrEEK Campus, Downtown',
        capacity: 150,
        organizer: admin._id
      },
      {
        title: 'Alexandria Coastal Indie Night',
        description: 'An evening of live indie music, art installations, and local culture.',
        category: categoryMap['Music & Arts'],
        date: '2026-03-10T20:00:00.000Z',
        city: 'Alexandria',
        venue: 'Bibliotheca Alexandrina Conference Center',
        capacity: 80,
        organizer: admin._id
      },
      {
        title: 'Delta Startup Pitch & Connect',
        description: 'Pitch sessions and angel networking designed for founders and operators.',
        category: categoryMap['Business & Startups'],
        date: '2026-04-06T17:30:00.000Z',
        city: 'Mansoura',
        venue: 'Mansoura Cultural Center',
        capacity: 60,
        organizer: admin._id
      },
      {
        title: 'Red Sea Sunset Community Run',
        description: 'A scenic community run and wellness gathering by the coast.',
        category: categoryMap['Sports & Wellness'],
        date: '2026-05-21T16:00:00.000Z',
        city: 'Hurghada',
        venue: 'El Gouna Promenade',
        capacity: 200,
        organizer: admin._id
      }
    ];

    await Event.insertMany(sampleEvents);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
