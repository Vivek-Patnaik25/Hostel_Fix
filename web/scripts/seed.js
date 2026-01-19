const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: './.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Simple schemas for seeding
const UserSchema = new mongoose.Schema({
    erpId: { type: String, unique: true },
    name: String,
    email: String,
    role: String,
    hostelNo: String,
    roomNo: String,
});

const ComplaintSchema = new mongoose.Schema({
    ticketId: String,
    userId: mongoose.Schema.Types.ObjectId,
    category: String,
    title: String,
    description: String,
    roomNo: String,
    hostelNo: String,
    status: String,
    priority: String,
    createdAt: Date
});

const User = mongoose.model('User', UserSchema);
const Complaint = mongoose.model('Complaint', ComplaintSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Complaint.deleteMany({});

        console.log('Cleared existing data');

        // Create Users
        const users = [];

        // Admin
        users.push(await User.create({
            erpId: 'ADMIN001',
            name: 'System Admin',
            email: 'admin@hostel.com',
            role: 'admin'
        }));

        // Staff
        const staff = await User.create({
            erpId: 'STAFF001',
            name: 'Ram Kumar (Electrician)',
            email: 'staff@hostel.com',
            role: 'staff'
        });
        users.push(staff);

        // Students
        const students = [];
        for (let i = 0; i < 5; i++) {
            students.push(await User.create({
                erpId: `2024CS${1000 + i}`,
                name: faker.person.fullName(),
                email: faker.internet.email(),
                role: 'student',
                hostelNo: 'H3',
                roomNo: `${100 + i}`
            }));
        }

        console.log('Created Users');

        // Create Complaints
        const categories = ['electrical', 'plumbing', 'internet'];
        const statuses = ['pending', 'assigned', 'in_progress', 'resolved'];
        const priorities = ['low', 'medium', 'high'];

        for (let i = 0; i < 10; i++) {
            const student = students[Math.floor(Math.random() * students.length)];
            await Complaint.create({
                ticketId: `HMRS-2024-${100 + i}-H3`,
                userId: student._id,
                category: categories[Math.floor(Math.random() * categories.length)],
                title: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                roomNo: student.roomNo,
                hostelNo: student.hostelNo,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                createdAt: faker.date.recent()
            });
        }

        console.log('Created Complaints');
        console.log('Seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
