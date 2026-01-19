'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import ComplaintCard from '@/components/ComplaintCard';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/hooks/useSocket';
import { useEffect } from 'react';

async function fetchComplaints() {
    const res = await fetch('/api/complaints/user');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export default function StudentDashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['my-complaints'],
        queryFn: fetchComplaints
    });

    if (isLoading) return <div className="p-4">Loading complaints...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading complaints</div>;

    const complaints = data?.complaints || [];

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        My Complaints
                    </h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <Link href="/student/new">
                        <Button>Report New Issue</Button>
                    </Link>
                </div>
            </div>

            {complaints.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No complaints</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new complaint.</p>
                    <div className="mt-6">
                        <Link href="/student/new">
                            <Button variant='outline'>New Complaint</Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    {complaints.map((complaint: any) => (
                        <ComplaintCard key={complaint._id} complaint={complaint} />
                    ))}
                </div>
            )}
        </div>
    );
}
