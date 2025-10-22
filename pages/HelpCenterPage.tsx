import React from 'react';
import FaqAccordion from '../components/FaqAccordion';

const faqs = [
    {
        question: 'How do I request a language service?',
        answer: 'Simply navigate to our "Services" page, fill out the request form with your project details, and our team will get in touch with you to connect you with a verified vendor who fits your needs.'
    },
    {
        question: 'How are vendors verified?',
        answer: 'All our service providers go through a rigorous verification process. This includes an assessment of their language proficiency, a review of their professional experience, and identity verification to ensure you receive high-quality, reliable services.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We securely process payments through trusted platforms like Paystack and Flutterwave. You can use debit/credit cards, bank transfers, and other local payment options available through these gateways.'
    },
    {
        question: 'Can I become a tutor or service provider?',
        answer: 'Yes! We are always looking for talented Igbo language professionals. You can apply by signing up and selecting a service role. You will then be prompted to complete our identity and skill verification process.'
    },
    {
        question: 'Is there a commission fee for services?',
        answer: 'For tutoring services booked through the platform, we take a small 10% commission to cover platform maintenance and payment processing fees. For other language services, the admin team will provide a custom quote that includes all fees.'
    }
];

const HelpCenterPage: React.FC = () => {
    return (
        <div className="bg-white">
            <header className="bg-light-lavender py-20 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-primary-text">Help Center</h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary-text">
                        Have questions? We're here to help. Find answers to common questions below.
                    </p>
                </div>
            </header>

            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="font-unica-one text-3xl font-bold text-primary-text mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FaqAccordion key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                     <div className="mt-16 text-center bg-light-lavender p-8 rounded-lg">
                        <h3 className="font-unica-one text-2xl font-bold text-primary-text">Can't find an answer?</h3>
                        <p className="text-secondary-text mt-2 mb-4">Our support team is happy to assist you. Please reach out to us directly.</p>
                        <a href="mailto:support@onyiigbo.com" className="font-bold text-accent-primary hover:text-accent-hover text-lg">
                            support@onyiigbo.com
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpCenterPage;