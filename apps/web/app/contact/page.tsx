'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, MapPin, Clock } from 'lucide-react'
import { MarketingLayout } from '@/components/layouts/MarketingLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { toast } from '@/components/ui/Toast'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({ type: 'success', title: 'Message sent!', message: "We'll get back to you soon." })
    form.reset()
    setIsSubmitting(false)
  }

  return (
    <MarketingLayout>
      <section className="pt-32 pb-24 bg-surface">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="heading-1 text-foreground mb-4">Get in touch</h1>
              <p className="body-large max-w-2xl mx-auto">
                Have a question or feedback? We'd love to hear from you. Send us a message and 
                we'll respond as soon as possible.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact info cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <Card padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a 
                        href="mailto:reservationwebbitz@gmail.com"
                        className="text-foreground-muted hover:text-primary-500 transition-colors"
                      >
                        reservationwebbitz@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Response time</h3>
                      <p className="text-foreground-muted">
                        Usually within 24 hours
                      </p>
                    </div>
                  </div>
                </Card>

                <Card padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Social</h3>
                      <div className="flex gap-3">
                        <a 
                          href="https://twitter.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground-muted hover:text-primary-500 transition-colors"
                        >
                          Twitter
                        </a>
                        <a 
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground-muted hover:text-primary-500 transition-colors"
                        >
                          Instagram
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Contact form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card padding="lg">
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        {...form.register('name')}
                        label="Name"
                        placeholder="Your name"
                        error={form.formState.errors.name?.message}
                      />
                      <Input
                        {...form.register('email')}
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        error={form.formState.errors.email?.message}
                      />
                    </div>

                    <Select
                      {...form.register('subject')}
                      label="Subject"
                      placeholder="Select a subject"
                      options={[
                        { value: 'general', label: 'General inquiry' },
                        { value: 'support', label: 'Technical support' },
                        { value: 'billing', label: 'Billing question' },
                        { value: 'feedback', label: 'Feedback' },
                        { value: 'partnership', label: 'Partnership' },
                      ]}
                      error={form.formState.errors.subject?.message}
                    />

                    <Textarea
                      {...form.register('message')}
                      label="Message"
                      placeholder="How can we help you?"
                      error={form.formState.errors.message?.message}
                    />

                    <Button type="submit" isLoading={isSubmitting}>
                      <Send className="h-4 w-4" />
                      Send message
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
