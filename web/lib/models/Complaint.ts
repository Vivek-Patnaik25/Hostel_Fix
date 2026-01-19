import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
    ticketId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
        type: String,
        enum: ['electrical', 'plumbing', 'carpentry', 'furniture', 'internet', 'other'],
        required: true
    },
    subCategory: String,
    title: String,
    description: String,
    roomNo: String,
    hostelNo: String,
    contactPhone: String,
    images: [String],
    preferredTime: {
        slot: { type: String, enum: ['morning', 'afternoon', 'evening', 'anytime'] },
        date: Date
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in_progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updates: [{
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        images: [String],
        createdAt: { type: Date, default: Date.now }
    }],
    resolution: {
        resolvedAt: Date,
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String,
        cost: Number,
        signature: String
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'Repmaintain' });

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
