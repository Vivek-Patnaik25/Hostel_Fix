'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { UploadButton } from '@uploadthing/react';

const formSchema = z.object({
    category: z.enum(['electrical', 'plumbing', 'carpentry', 'furniture', 'internet', 'other']),
    subCategory: z.string().min(1, 'Required'),
    title: z.string().min(5, 'Title too short'),
    description: z.string().min(10, 'Please provide more details'),
    preferredTime: z.object({
        slot: z.enum(['morning', 'afternoon', 'evening', 'anytime']),
    }),
    contactPhone: z.string().min(10, 'Valid phone number required'),
    images: z.array(z.string()).optional()
});

type FormData = z.infer<typeof formSchema>;

export default function NewComplaintPage() {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            preferredTime: { slot: 'anytime' }
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            const payload = { ...data, images };
            const res = await fetch('/api/complaints', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/student/dashboard');
                router.refresh();
            } else {
                alert('Failed to submit complaint');
            }
        } catch (e) {
            console.error(e);
            alert('Error submitting complaint');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">New Maintenance Request</h1>
                <p className="mt-1 text-gray-500">Submit a new complaint regarding hostel facilities.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 shadow rounded-lg">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        {...register('category')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="carpentry">Carpentry</option>
                        <option value="furniture">Furniture</option>
                        <option value="internet">Internet</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>

                <Input
                    label="Sub Category (e.g. Fan, Light, Tap)"
                    {...register('subCategory')}
                    error={errors.subCategory?.message}
                />

                <Input
                    label="Title"
                    {...register('title')}
                    error={errors.title?.message}
                    placeholder="Brief title of the issue"
                />

                <Textarea
                    label="Description"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Detailed description of the problem..."
                />

                {/* Added Contact Number Field */}
                <Input
                    label="Contact Number"
                    {...register('contactPhone')}
                    // @ts-ignore
                    error={errors.contactPhone?.message}
                    placeholder="Your mobile number"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time for Visit</label>
                    <select
                        {...register('preferredTime.slot')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="anytime">Anytime</option>
                        <option value="morning">Morning (9AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="evening">Evening (4PM - 7PM)</option>
                    </select>
                </div>

                {/* Simplified Image Upload Placeholder for Prototype if Uploadthing not fully configured */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                        <p className="text-sm text-gray-500">Image upload configured via Uploadthing (requires API keys)</p>
                        {/* <UploadButton ... /> */}
                    </div>
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </Button>
                </div>

            </form>
        </div>
    );
}
