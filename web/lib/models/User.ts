import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    erpId: { type: String, unique: true },
    name: String,
    email: String,
    phone: String,
    hostelNo: String,
    roomNo: String,
    role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
