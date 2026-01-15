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
                Last updated: January 2026
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">1. Agreement to Terms</h2>
              <p className="text-foreground-muted mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you 
                ("User", "you", or "your") and Diego Simoncini, operating as AI Home Designer 
                ("we", "us", "our", or "Service Provider"). By accessing, using, or registering 
                for AI Home Designer (the "Service"), you agree to be bound by these Terms and all 
                applicable laws and regulations worldwide.
              </p>
              <p className="text-foreground-muted mb-4">
                If you do not agree with any part of these Terms, you must not access or use the 
                Service. These Terms apply to all users of the Service, including without limitation 
                users who are browsers, vendors, customers, merchants, and contributors of content.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">2. Service Description</h2>
              <p className="text-foreground-muted mb-4">
                AI Home Designer is an AI-powered service that processes images to generate interior 
                design concepts and visualizations. The Service allows you to upload images, which 
                are stored on our servers, and receive AI-generated design outputs.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">3. Account Registration and Eligibility</h2>
              <p className="text-foreground-muted mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information to keep it accurate</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Be at least 13 years old (or 16 in the European Union) to use the Service</li>
              </ul>
              <p className="text-foreground-muted mb-4">
                You are prohibited from sharing your account credentials or allowing others to access 
                your account. You must notify us immediately of any unauthorized use of your account.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">4. Use License and Intellectual Property</h2>
              <h3 className="heading-4 text-foreground mt-6 mb-3">4.1 License to Use Service</h3>
              <p className="text-foreground-muted mb-4">
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, 
                non-transferable, revocable license to access and use the Service for personal and 
                commercial purposes.
              </p>
              
              <h3 className="heading-4 text-foreground mt-6 mb-3">4.2 Ownership of Generated Content</h3>
              <p className="text-foreground-muted mb-4">
                You retain all ownership rights to images you upload. With respect to AI-generated 
                content created by the Service from your uploads:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>You own the generated images and may use them for any lawful purpose, including 
                personal and commercial use</li>
                <li>You may modify, distribute, and create derivative works from generated images</li>
                <li>You may not claim ownership of the underlying AI technology or algorithms</li>
                <li>You may not resell, redistribute, or sublicense the Service itself</li>
                <li>You may not use the Service to create content that violates these Terms or 
                applicable laws</li>
              </ul>

              <h3 className="heading-4 text-foreground mt-6 mb-3">4.3 Our Intellectual Property</h3>
              <p className="text-foreground-muted mb-4">
                The Service, including its original content, features, functionality, design, logos, 
                trademarks, and software, is owned by Diego Simoncini and is protected by 
                international copyright, trademark, patent, trade secret, and other intellectual 
                property laws.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">5. Image Storage and Processing</h2>
              <p className="text-foreground-muted mb-4">
                By using the Service, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>We store all images you upload on our servers</li>
                <li>We store all AI-generated images created from your uploads</li>
                <li>Images are stored to provide you with access to your design history and 
                sharing capabilities</li>
                <li>We process your images using AI technology to generate designs</li>
                <li>You grant us a license to store, process, and display your images as 
                necessary to provide the Service</li>
                <li>You may request deletion of your images at any time, subject to our data 
                retention policies</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">6. User Content and Prohibited Uses</h2>
              <h3 className="heading-4 text-foreground mt-6 mb-3">6.1 Your Responsibility</h3>
              <p className="text-foreground-muted mb-4">
                You are solely responsible for all content you upload, including images. You represent 
                and warrant that:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>You own or have the necessary rights, licenses, and permissions to upload 
                and use the content</li>
                <li>Your content does not infringe on any third-party intellectual property rights, 
                privacy rights, or other rights</li>
                <li>Your content complies with all applicable laws and regulations</li>
              </ul>

              <h3 className="heading-4 text-foreground mt-6 mb-3">6.2 Prohibited Content</h3>
              <p className="text-foreground-muted mb-4">
                You agree not to upload, post, or transmit any content that:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Infringes on intellectual property rights, including copyrights, trademarks, 
                or patents</li>
                <li>Contains illegal, harmful, threatening, abusive, harassing, defamatory, 
                vulgar, obscene, or otherwise objectionable material</li>
                <li>Violates the privacy or publicity rights of others</li>
                <li>Contains personal information of others without consent</li>
                <li>Contains malware, viruses, or other harmful code</li>
                <li>Is designed to interfere with or disrupt the Service</li>
                <li>Violates any applicable local, state, national, or international law</li>
              </ul>

              <h3 className="heading-4 text-foreground mt-6 mb-3">6.3 Prohibited Activities</h3>
              <p className="text-foreground-muted mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to the Service or its related systems</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">7. Credits, Payments, and Refunds</h2>
              <h3 className="heading-4 text-foreground mt-6 mb-3">7.1 Credits System</h3>
              <p className="text-foreground-muted mb-4">
                The Service operates on a credit-based system. Credits are required to generate 
                designs. Credits purchased do not expire unless otherwise stated.
              </p>

              <h3 className="heading-4 text-foreground mt-6 mb-3">7.2 Payment Terms</h3>
              <p className="text-foreground-muted mb-4">
                All payments are processed securely through Stripe. By making a purchase, you agree 
                to provide current, complete, and accurate purchase and account information. You 
                agree to pay all charges incurred by your account, including applicable taxes.
              </p>

              <h3 className="heading-4 text-foreground mt-6 mb-3">7.3 Refund Policy</h3>
              <p className="text-foreground-muted mb-4">
                Refunds are available within 7 days of purchase if no credits from that purchase 
                have been used. To request a refund, contact us at{' '}
                <a href="mailto:reservationwebbitz@gmail.com" className="text-primary-500 hover:underline">
                  reservationwebbitz@gmail.com
                </a>. Once credits have been used, refunds are not available except as required 
                by applicable consumer protection laws.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">8. Service Availability and Modifications</h2>
              <p className="text-foreground-muted mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Modify, suspend, or discontinue the Service at any time, with or without notice</li>
                <li>Update, change, or remove features of the Service</li>
                <li>Impose limits on usage or restrict access to the Service</li>
                <li>Perform maintenance that may temporarily interrupt service availability</li>
              </ul>
              <p className="text-foreground-muted mb-4">
                We do not guarantee that the Service will be available at all times or that it will 
                be error-free. We are not liable for any loss or damage resulting from Service 
                unavailability.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">9. Disclaimers and Warranties</h2>
              <p className="text-foreground-muted mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF 
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF 
                PERFORMANCE.
              </p>
              <p className="text-foreground-muted mb-4">
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>The Service will meet your requirements or expectations</li>
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from using the Service will be accurate or reliable</li>
                <li>Any errors in the Service will be corrected</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">10. Limitation of Liability</h2>
              <p className="text-foreground-muted mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL DIEGO SIMONCINI, 
                AI HOME DESIGNER, OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, 
                DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Your use or inability to use the Service</li>
                <li>Any conduct or content of third parties on the Service</li>
                <li>Unauthorized access to or alteration of your transmissions or data</li>
                <li>Any other matter relating to the Service</li>
              </ul>
              <p className="text-foreground-muted mb-4">
                Our total liability for any claims arising from or related to the Service shall not 
                exceed the amount you paid us in the 12 months preceding the claim, or $100, 
                whichever is greater.
              </p>
              <p className="text-foreground-muted mb-4">
                Some jurisdictions do not allow the exclusion of certain warranties or the limitation 
                of liability for incidental or consequential damages. In such jurisdictions, our 
                liability shall be limited to the maximum extent permitted by law.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">11. Indemnification</h2>
              <p className="text-foreground-muted mb-4">
                You agree to indemnify, defend, and hold harmless Diego Simoncini, AI Home Designer, 
                and its affiliates, officers, directors, employees, and agents from and against any 
                and all claims, damages, obligations, losses, liabilities, costs, or debt, and 
                expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-foreground-muted space-y-2 mb-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party right, including intellectual property or 
                privacy rights</li>
                <li>Any content you upload or transmit through the Service</li>
              </ul>

              <h2 className="heading-3 text-foreground mt-8 mb-4">12. Termination</h2>
              <p className="text-foreground-muted mb-4">
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice or liability, for any reason, including if you breach these 
                Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
              <p className="text-foreground-muted mb-4">
                You may terminate your account at any time by contacting us or using account 
                deletion features. Upon termination, we will delete your account and associated 
                data in accordance with our Privacy Policy, subject to legal retention requirements.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">13. Governing Law and Dispute Resolution</h2>
              <h3 className="heading-4 text-foreground mt-6 mb-3">13.1 Governing Law</h3>
              <p className="text-foreground-muted mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the 
                jurisdiction in which Diego Simoncini operates, without regard to its conflict of 
                law provisions.
              </p>

              <h3 className="heading-4 text-foreground mt-6 mb-3">13.2 Dispute Resolution</h3>
              <p className="text-foreground-muted mb-4">
                Any disputes arising from or relating to these Terms or the Service shall be resolved 
                through good faith negotiation. If negotiation fails, disputes shall be resolved 
                through binding arbitration or in courts of competent jurisdiction, as applicable 
                under local law.
              </p>
              <p className="text-foreground-muted mb-4">
                For users in the European Union, you may also have the right to bring proceedings 
                in your country of residence.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">14. Changes to Terms</h2>
              <p className="text-foreground-muted mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of any 
                material changes by posting the updated Terms on this page and updating the "Last 
                updated" date. Your continued use of the Service after such changes constitutes 
                your acceptance of the modified Terms.
              </p>
              <p className="text-foreground-muted mb-4">
                If you do not agree to the modified Terms, you must stop using the Service and may 
                terminate your account.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">15. Severability</h2>
              <p className="text-foreground-muted mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, that 
                provision shall be limited or eliminated to the minimum extent necessary, and the 
                remaining provisions shall remain in full force and effect.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">16. Entire Agreement</h2>
              <p className="text-foreground-muted mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement 
                between you and us regarding the Service and supersede all prior agreements and 
                understandings.
              </p>

              <h2 className="heading-3 text-foreground mt-8 mb-4">17. Contact Information</h2>
              <p className="text-foreground-muted mb-4">
                For questions, concerns, or legal notices regarding these Terms, please contact:
              </p>
              <p className="text-foreground-muted mb-4">
                <strong>Service Provider:</strong> Diego Simoncini<br />
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
