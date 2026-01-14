import { MarketingLayout } from '@/components/layouts/MarketingLayout'

export const metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-24 bg-surface">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="heading-1 text-foreground mb-8">Privacy Policy</h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="body-large text-foreground-muted mb-8">
                Last updated: January 2024
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-foreground-muted mb-4">
                We collect information you provide directly to us:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Account information (email, name)</li>
                <li>Images you upload for processing</li>
                <li>Payment information (processed by Stripe)</li>
                <li>Usage data and preferences</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-foreground-muted mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Provide and maintain our services</li>
                <li>Process your transactions</li>
                <li>Send you technical notices and updates</li>
                <li>Improve and develop our services</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">3. Image Data</h2>
              <p className="text-foreground-muted mb-4">
                Images you upload are processed to generate designs and are stored temporarily for 
                job processing. Generated images are stored to provide your history and sharing features.
                You can request deletion of your images at any time.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">4. Data Security</h2>
              <p className="text-foreground-muted mb-4">
                We implement appropriate security measures to protect your personal information. 
                All data transmission is encrypted using SSL/TLS. Payment processing is handled 
                securely by Stripe.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">5. Data Retention</h2>
              <p className="text-foreground-muted mb-4">
                We retain your account information for as long as your account is active. Generated 
                images are retained for 90 days unless you request earlier deletion.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">6. Your Rights</h2>
              <p className="text-foreground-muted mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">7. Contact Us</h2>
              <p className="text-foreground-muted mb-4">
                For privacy-related questions, contact us at{' '}
                <a href="mailto:privacy@ai-homedesigner.com" className="text-primary-500 hover:underline">
                  privacy@ai-homedesigner.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
