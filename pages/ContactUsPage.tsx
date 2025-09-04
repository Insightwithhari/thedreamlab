import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon } from '../components/icons';

// Reusable component for contact details
const ContactInfo: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
            <div className="text-gray-300">{children}</div>
        </div>
    </div>
);

// Reusable component for a form field
const FormField: React.FC<{
    label: string;
    id: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isTextArea?: boolean;
}> = ({ label, id, type, placeholder, value, onChange, isTextArea }) => (
    <div>
        <label htmlFor={id} className="sr-only">
            {label}
        </label>
        {isTextArea ? (
            <textarea
                id={id}
                placeholder={placeholder}
                rows={4}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none resize-none"
            />
        ) : (
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none"
            />
        )}
    </div>
);

const ContactUsPage: React.FC = () => {
    // State management for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would typically send the data to a backend server
        console.log('Form Submitted:', formData);
        alert('Thank you for your message! We will get back to you shortly.');
        // Clear the form after submission
        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    return (
        <div className="p-4 md:p-8 text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10 text-cyan-300">Contact Us</h1>
                <p className="text-lg text-center text-gray-300 mb-12">
                    Have a question or want to collaborate? Reach out to us.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                    <div className="space-y-8">
                        <ContactInfo
                            icon={<EnvelopeIcon className="w-6 h-6 text-cyan-300" />}
                            title="Email Us"
                        >
                            <a href="mailto:contact@dreamlab.science" className="hover:underline">
                                contact@dreamlab.science
                            </a>
                        </ContactInfo>
                        <ContactInfo
                            icon={<PhoneIcon className="w-6 h-6 text-cyan-300" />}
                            title="Call Us"
                        >
                            <p>+1 (555) 123-4567</p>
                        </ContactInfo>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold text-cyan-400">Send a Message</h3>
                        <FormField
                            label="Your Name"
                            id="name"
                            type="text"
                            placeholder="Your Name (e.g., Jane Doe)"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Your Email"
                            id="email"
                            type="email"
                            placeholder="Your Email (e.g., janedoe@example.com)"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Your Message"
                            id="message"
                            type="text"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            isTextArea
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-md font-semibold transition-colors cursor-pointer"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;
