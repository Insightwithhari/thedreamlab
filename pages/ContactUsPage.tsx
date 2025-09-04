import React from 'react';
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
            
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">Send a Message</h3>
                <input type="text" placeholder="Your Name" className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none" />
                <input type="email" placeholder="Your Email" className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none" />
                <textarea placeholder="Your Message" rows={4} className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-cyan-500 focus:outline-none resize-none"></textarea>
                <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-md font-semibold transition-colors">
                    Submit
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
