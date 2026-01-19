import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight">
            HostelFix
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Hostel Maintenance Request System
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Streamlined issue reporting and tracking for students in hostels.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">
                Log in
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Access via your ERP Credentials
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 text-left">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="tex-lg font-medium text-gray-900">For Students</h3>
            <p className="mt-2 text-sm text-gray-500">
              Report electrical, plumbing, or internet issues instantly. Track status in real-time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="tex-lg font-medium text-gray-900">For Staff</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage tickets, assign tasks, and provide updates efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
