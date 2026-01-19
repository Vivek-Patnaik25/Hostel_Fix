'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';

async function fetchAllComplaints() {
    const res = await fetch('/api/complaints');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}

export default function StaffDashboard() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['all-complaints'],
        queryFn: fetchAllComplaints
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error('Failed to update');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-complaints'] });
        }
    });

    if (isLoading) return <div>Loading...</div>;

    const complaints = data?.complaints || [];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Staff Dashboard</h2>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {complaints.length === 0 && <li className="p-4 text-center text-gray-500">No complaints found</li>}
                    {complaints.map((complaint: any) => (
                        <li key={complaint._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-indigo-600 truncate">{complaint.title}</p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500 mr-6">
                                            {complaint.ticketId}
                                        </p>
                                        <p className="flex items-center text-sm text-gray-500 mr-6">
                                            {complaint.hostelNo} - {complaint.roomNo}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            Created {format(new Date(complaint.createdAt), 'MMM d')}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">{complaint.description}</p>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Contact: <span className="font-semibold text-gray-900">{complaint.contactPhone || complaint.userId?.phone || 'N/A'}</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    {complaint.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            onClick={() => updateStatusMutation.mutate({ id: complaint._id, status: 'assigned' })}
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            Accept
                                        </Button>
                                    )}
                                    {complaint.status === 'assigned' && (
                                        <Button
                                            size="sm"
                                            onClick={() => updateStatusMutation.mutate({ id: complaint._id, status: 'in_progress' })}
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            Start Work
                                        </Button>
                                    )}
                                    {complaint.status === 'in_progress' && (
                                        <Button
                                            size="sm"
                                            onClick={() => updateStatusMutation.mutate({ id: complaint._id, status: 'resolved' })}
                                            disabled={updateStatusMutation.isPending}
                                        >
                                            Resolve
                                        </Button>
                                    )}

                                    <a href={`mailto:${complaint.userId?.email}`} className="text-indigo-600 text-sm ml-auto self-center hover:underline">
                                        Contact Student
                                    </a>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
