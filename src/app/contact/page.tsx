'use client';
import React, { useState } from 'react'; // Import useState
import Link from 'next/link';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from 'axios'; // Import axios
import Toast from '../../components/Toast'; // Import Toast

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setToast(null);

        try {
            const res = await axios.post('http://localhost:5000/api/feedback/submit', formData);
            setToast({ message: res.data.message, type: 'success' });
            setFormData({ name: '', email: '', phone: '', message: '' }); // Clear form
        } catch (error) {
            console.error('Error submitting feedback:', error);
            if (axios.isAxiosError(error) && error.response) {
                setToast({ message: error.response.data.message || 'Failed to submit feedback', type: 'error' });
            } else {
                setToast({ message: 'An unexpected error occurred', type: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container m-auto px-4 py-16">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h1 className="text-3xl font-medium text-center  text-gray-700">Contact Us</h1>
            <p className="mb-4 text-xl text-center font-medium  text-gray-700">We did love to hear from you! Please fill out the form below and we will get back to you as soon as possible.</p>
            <div className="flex w-full justify-center items-center mt-8">
                <div className="w-1/2" >
                    <h2 className="text-3xl font-bold mb-4 text-gray-700">Our Location</h2>
                    <p className="text-3xl font-display font-medium  text-gray-700">Sunshine</p>
                    <p className="mb-4 font-medium mt-2 text-gray-700">1/A AdaborThana, Mohammadpur, 1133/C<br/>Dhaka, Bangladesh<br/>Call us:<Link href='/call.+880123456789' className='text-black hover:text-orange-600'>+880123456789</Link><br/><span className='flex'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>Mail us:<Link href="tel:+8801234567890" className="text-black hover:text-orange-600">customer.sunshine@gmail.com</Link></span></p>
                    <LoadScript googleMapsApiKey="AIzaSyCmjhBnAveZY54h0ENwjQce4kCtp-T-x_M">
                        <GoogleMap
                            mapContainerStyle={{ height: "300px", width: "80%",margin:"" }}
                            center={{ lat: 23.774481, lng: 90.357880 }} // Centered on Dhaka
                            zoom={13}
                        >
                            <Marker position={{ lat: 23.774481, lng: 90.357880 }} />
                        </GoogleMap>
                    </LoadScript>
                </div>
                <div className='w-1/3 mr-'>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Submit Feedback'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}