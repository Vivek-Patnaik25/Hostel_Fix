import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Complaint from '@/lib/models/Complaint';
import connectDB from '@/lib/mongodb';
import { generateTicketId } from '@/lib/utils';

export async function POST(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        const ticketId = generateTicketId(session.user.hostelNo || "GEN");

        const priority = detectPriority(data.description || "");

        const complaint = await Complaint.create({
            ticketId,
            userId: session.user.id,
            category: data.category,
            subCategory: data.subCategory,
            title: data.title,
            description: data.description,
            roomNo: session.user.roomNo,
            hostelNo: session.user.hostelNo,
            images: data.images || [],
            preferredTime: data.preferredTime,
            priority,
            status: 'pending'
        });

        return NextResponse.json({
            success: true,
            ticketId: complaint.ticketId,
            message: 'Complaint registered successfully',
            complaint
        });

    } catch (error: any) {
        console.error("Complaint creation error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let filter = {};
        if (session.user.role === 'student') {
            // Students should use /api/complaints/user, but if they hit this, redirect or filter
            filter = { userId: session.user.id };
        } else if (session.user.role === 'staff') {
            // Staff see complaints assigned to them OR relevant to their trade (simplified: all for prototype or specific logic)
            // For prototype: All complaints in their hostel or just All
            filter = {}; // Staff sees all for now
        }

        const complaints = await Complaint.find(filter)
            .sort({ createdAt: -1 })
            .populate('userId', 'name roomNo hostelNo');

        return NextResponse.json({ complaints });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function detectPriority(description: string) {
    const desc = description.toLowerCase();
    if (desc.includes('fire') || desc.includes('flood') || desc.includes('spark') || desc.includes('smoke') || desc.includes('danger')) {
        return 'emergency';
    } else if (desc.includes('not working') || desc.includes('broken') || desc.includes('leak') || desc.includes('power')) {
        return 'high';
    } else if (desc.includes('loose') || desc.includes('creaky')) {
        return 'low';
    }
    return 'medium';
}
