import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-white">
      <header className="bg-light-lavender py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-unica-one text-5xl md:text-6xl font-bold text-primary-text">Terms of Service</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto text-secondary-text">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl prose lg:prose-lg">
          <p>
            Welcome to OnyiIgbo. These Terms of Service ("Terms") govern your use of the OnyiIgbo website and the services offered through it. By accessing or using our platform, you agree to be bound by these Terms.
          </p>

          <h2>1. Account Registration</h2>
          <p>
            To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>

          <h2>2. Services</h2>
          <p>
            OnyiIgbo provides a platform for clients to connect with language service providers ("Vendors") for services including, but not limited to, translation, transcription, and tutoring. We act as an intermediary and are not a party to the direct contractual relationship between clients and Vendors.
          </p>

          <h2>3. Payments and Fees</h2>
          <p>
            Clients agree to pay the fees for services as quoted by OnyiIgbo or as listed for tutoring sessions. For tutoring, we charge a 10% commission fee from the Vendor's earnings. All payments are processed through third-party payment gateways like Paystack or Flutterwave.
          </p>
          
          <h2>4. User Conduct</h2>
          <p>
            You agree not to use the platform for any unlawful purpose or in any way that could harm OnyiIgbo, its users, or any third party. This includes, but is not limited to, posting defamatory content, infringing on intellectual property rights, or distributing spam.
          </p>

          <h2>5. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the services immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms.
          </p>

          <h2>6. Disclaimers and Limitation of Liability</h2>
          <p>
            The services are provided on an "AS IS" and "AS AVAILABLE" basis. OnyiIgbo makes no warranties, expressed or implied, regarding the reliability or availability of the service. In no event shall OnyiIgbo be liable for any indirect, incidental, special, consequential, or punitive damages.
          </p>
          
           <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
          </p>

          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@onyiigbo.com">legal@onyiigbo.com</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;