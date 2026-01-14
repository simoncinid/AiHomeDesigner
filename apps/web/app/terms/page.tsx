import { MarketingLayout } from '@/components/layouts/MarketingLayout'

export const metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <MarketingLayout>
      <section className="pt-32 pb-24 bg-surface">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="heading-1 text-foreground mb-8">Terms of Service</h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="body-large text-foreground-muted mb-8">
                Last updated: January 2024
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-foreground-muted mb-4">
                By accessing or using AI Home Designer, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using this service.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">2. Use License</h2>
              <p className="text-foreground-muted mb-4">
                Permission is granted to use AI Home Designer for personal and commercial purposes. 
                All generated content is owned by you and may be used for any lawful purpose.
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>You may use generated images for personal projects</li>
                <li>You may use generated images for commercial purposes</li>
                <li>You may not claim the AI technology as your own</li>
                <li>You may not resell or redistribute the service itself</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">3. Credits and Payments</h2>
              <p className="text-foreground-muted mb-4">
                Credits purchased on AI Home Designer do not expire. Refunds are available within 
                7 days of purchase if no credits from that pack have been used.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">4. User Content</h2>
              <p className="text-foreground-muted mb-4">
                You are responsible for the images you upload. Do not upload content that:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Infringes on intellectual property rights</li>
                <li>Contains illegal or harmful content</li>
                <li>Violates the privacy of others</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
              <p className="text-foreground-muted mb-4">
                AI Home Designer is provided "as is" without warranties of any kind. We are not 
                liable for any damages arising from the use of this service.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">6. Contact</h2>
              <p className="text-foreground-muted mb-4">
                For questions about these Terms, contact us at{' '}
                <a href="mailto:legal@ai-homedesigner.com" className="text-primary-500 hover:underline">
                  legal@ai-homedesigner.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
