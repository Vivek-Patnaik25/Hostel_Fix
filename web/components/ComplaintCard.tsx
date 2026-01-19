import { format } from 'date-fns';
import Link from 'next/link';

interface ComplaintCardProps {
    complaint: {
        _id: string;
        ticketId: string;
        title: string;
        category: string;
        status: string;
        createdAt: string;
        priority: string;
    };
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
    const statusColors: any = {
        pending: 'bg-yellow-100 text-yellow-800',
        assigned: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        resolved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    const priorityColors: any = {
        low: 'text-gray-500',
        medium: 'text-blue-500',
        high: 'text-orange-500',
        emergency: 'text-red-600 font-bold',
    };

    return (
        <Link href={`/student/complaints/${complaint._id}`} className="block">
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[complaint.status] || 'bg-gray-100 text-gray-800'}`}>
                                {complaint.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <h3 className="mt-2 text-lg leading-6 font-medium text-gray-900 group-hover:text-indigo-600">
                                {complaint.title}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                {complaint.ticketId} • <span className="capitalize">{complaint.category}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-xs font-medium ${priorityColors[complaint.priority]}`}>
                                {complaint.priority.toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
