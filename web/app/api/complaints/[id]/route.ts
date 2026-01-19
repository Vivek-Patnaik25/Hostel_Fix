import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Complaint from '@/lib/models/Complaint';
import connectDB from '@/lib/mongodb';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const data = await request.json();

        // Check permissions
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
        }

        // Students can't update status directly in this prototype, only staff/admin
        if (session.user.role === 'student' && data.status) {
            return NextResponse.json({ error: 'Unauthorized to change status' }, { status: 403 });
        }

        // Logic for updates
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            {
                $set: { ...data },
                $push: {
                    updates: {
                        status: data.status,
                        note: data.note || 'Status updated',
                        updatedBy: session.user.id,
                        createdAt: new Date()
                    }
                }
            },
            { new: true }
        );

        return NextResponse.json({ success: true, complaint: updatedComplaint });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;
        const complaint = await Complaint.findById(id).populate('userId', 'name erpId').populate('assignedTo', 'name');

        if (!complaint) {
            return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
        }

        return NextResponse.json({ complaint });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
