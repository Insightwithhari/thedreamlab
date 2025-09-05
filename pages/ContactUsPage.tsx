import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon } from '../components/icons';

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


const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      // In a real app, you'd send this data to a server.
      // Here, we'll just simulate a successful submission.
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000); // Reset after 5 seconds
    } else {
      alert('Please fill out all fields.');
    }
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
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none" required />
                <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none" required />
                <textarea name="message" placeholder="Your Message" rows={4} value={formData.message} onChange={handleChange} className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none resize-none" required></textarea>
                <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-md font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                    Submit
                </button>
                {isSubmitted && (
                    <p className="text-green-400 text-center mt-2">Thank you! Your message has been sent.</p>
                )}
            </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
