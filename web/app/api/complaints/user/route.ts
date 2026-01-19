import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Complaint from '@/lib/models/Complaint';
import connectDB from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const complaints = await Complaint.find({ userId: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json({ complaints });
    } catch (error: any) {
        console.error("API Error (/api/complaints/user):", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
