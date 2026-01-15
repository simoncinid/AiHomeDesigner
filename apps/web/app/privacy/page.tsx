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
                Last updated: January 2026
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">1. Introduction</h2>
              <p className="text-foreground-muted mb-4">
                This Privacy Policy describes how AI Home Designer ("we", "our", or "us") collects, 
                uses, and protects your personal information when you use our service. This policy 
                complies with applicable data protection laws worldwide, including the General Data 
                Protection Regulation (GDPR) in the European Union, the California Consumer Privacy 
                Act (CCPA) in California, and other applicable privacy laws.
              </p>
              <p className="text-foreground-muted mb-4">
                <strong>Data Controller:</strong> Diego Simoncini<br />
                <strong>Contact Email:</strong>{' '}
                <a href="mailto:reservationwebbitz@gmail.com" className="text-primary-500 hover:underline">
                  reservationwebbitz@gmail.com
                </a>
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">2. Information We Collect</h2>
              <p className="text-foreground-muted mb-4">
                We collect information you provide directly to us:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li><strong>Account Information:</strong> Email address, name, and password (hashed)</li>
                <li><strong>Images:</strong> Images you upload for processing, which we store and retain on our servers</li>
                <li><strong>Generated Content:</strong> AI-generated images and designs created from your uploads</li>
                <li><strong>Payment Information:</strong> Processed securely by Stripe (we do not store credit card details)</li>
                <li><strong>Usage Data:</strong> Information about how you use our service, including preferences and settings</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage logs</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-foreground-muted mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>To provide, maintain, and improve our services</li>
                <li>To process your transactions and manage your account</li>
                <li>To store and process your uploaded images to generate designs</li>
                <li>To store generated images for your access, history, and sharing features</li>
                <li>To send you technical notices, updates, and support messages</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To detect, prevent, and address technical issues and security threats</li>
                <li>To comply with legal obligations and enforce our terms</li>
              </ul>
              <p className="text-foreground-muted mb-4">
                <strong>Legal Basis (GDPR):</strong> We process your data based on (i) your consent, 
                (ii) performance of a contract, (iii) our legitimate interests, and (iv) compliance 
                with legal obligations.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">4. Image Storage and Retention</h2>
              <p className="text-foreground-muted mb-4">
                <strong>Image Storage:</strong> We store all images you upload and all generated images 
                on our secure servers. This includes:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Original images you upload for processing</li>
                <li>AI-generated images and designs created from your uploads</li>
                <li>Images are stored to provide you with access to your design history and sharing capabilities</li>
              </ul>
              <p className="text-foreground-muted mb-4">
                <strong>Retention Period:</strong> We retain your images and account information for as 
                long as your account is active, unless you request deletion. You may request deletion of 
                your images at any time by contacting us at{' '}
                <a href="mailto:reservationwebbitz@gmail.com" className="text-primary-500 hover:underline">
                  reservationwebbitz@gmail.com
                </a>. Upon account deletion, we will delete your images within 30 days, subject to 
                legal retention requirements.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-foreground-muted mb-4">
                We do not sell your personal information. We may share your information only in the 
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who 
                assist us in operating our service (e.g., hosting, payment processing, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or 
                government regulation</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or 
                sale of assets (with notice to users)</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share 
                your information</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">6. Data Security</h2>
              <p className="text-foreground-muted mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Encryption of data in transit using SSL/TLS protocols</li>
                <li>Secure storage of data at rest with encryption</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure payment processing through Stripe (we do not store payment card details)</li>
              </ul>
              <p className="text-foreground-muted mb-4">
                However, no method of transmission over the Internet or electronic storage is 100% 
                secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">7. International Data Transfers</h2>
              <p className="text-foreground-muted mb-4">
                Your information may be transferred to and processed in countries other than your 
                country of residence. We ensure that such transfers comply with applicable data 
                protection laws, including GDPR requirements for international transfers. By using 
                our service, you consent to the transfer of your information to our servers and 
                service providers located in various jurisdictions.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">8. Your Rights (GDPR, CCPA, and Other Jurisdictions)</h2>
              <p className="text-foreground-muted mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li><strong>Right of Access:</strong> Request a copy of your personal data we hold</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten")</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured, 
                machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent where processing is 
                based on consent</li>
                <li><strong>Right to Opt-Out (CCPA):</strong> Opt-out of the sale of personal information 
                (we do not sell your data)</li>
                <li><strong>Right to Non-Discrimination (CCPA):</strong> We will not discriminate 
                against you for exercising your privacy rights</li>
              </ul>
              <p className="text-foreground-muted mb-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:reservationwebbitz@gmail.com" className="text-primary-500 hover:underline">
                  reservationwebbitz@gmail.com
                </a>. We will respond to your request within 30 days (or as required by applicable law).
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">9. Cookies and Tracking Technologies</h2>
              <p className="text-foreground-muted mb-4">
                We use cookies and similar tracking technologies to enhance your experience, analyze 
                usage, and assist with security. You can control cookies through your browser settings. 
                Some features may not function properly if cookies are disabled.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">10. Children's Privacy</h2>
              <p className="text-foreground-muted mb-4">
                Our service is not intended for children under the age of 13 (or 16 in the EU). We do 
                not knowingly collect personal information from children. If you believe we have 
                collected information from a child, please contact us immediately and we will delete 
                such information.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-foreground-muted mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any 
                material changes by posting the new policy on this page and updating the "Last updated" 
                date. Your continued use of our service after such changes constitutes acceptance of 
                the updated policy.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">12. Supervisory Authority (GDPR)</h2>
              <p className="text-foreground-muted mb-4">
                If you are located in the European Economic Area (EEA) and believe we have not 
                addressed your privacy concerns, you have the right to lodge a complaint with your 
                local data protection supervisory authority.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">13. Contact Us</h2>
              <p className="text-foreground-muted mb-4">
                For any questions, concerns, or requests regarding this Privacy Policy or your 
                personal data, please contact:
              </p>
              <p className="text-foreground-muted mb-4">
                <strong>Data Controller:</strong> Diego Simoncini<br />
                <strong>Email:</strong>{' '}
                <a href="mailto:reservationwebbitz@gmail.com" className="text-primary-500 hover:underline">
                  reservationwebbitz@gmail.com
                </a>
              </p>
              <p className="text-foreground-muted mb-4">
                © 2026 AI Home Designer. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
