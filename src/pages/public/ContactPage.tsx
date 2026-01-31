import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../components/ui/Toast';
export function ContactPage() {
  const { organization } = useTheme();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      addToast(
        'Message sent successfully! We will get back to you soon.',
        'success'
      );
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Contact Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-gray-500 mb-12">
            Have questions about our community? We're here to help. Reach out to
            us and we'll respond as soon as possible.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600 mb-1">
                  Our friendly team is here to help.
                </p>
                <a
                  href={`mailto:${organization.contactEmail}`}
                  className="text-[var(--color-primary)] font-medium hover:underline">

                  {organization.contactEmail || 'contact@communityhub.com'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Office</h3>
                <p className="text-gray-600 mb-1">
                  Come say hello at our office headquarters.
                </p>
                <p className="text-gray-900 font-medium">
                  123 Community Lane,
                  <br />
                  San Francisco, CA 94105
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600 mb-1">Mon-Fri from 8am to 5pm.</p>
                <a
                  href="tel:+15551234567"
                  className="text-[var(--color-primary)] font-medium hover:underline">

                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 h-64 bg-gray-100 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <span className="text-sm font-medium">
                  Map View Placeholder
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                placeholder="Jane"
                value={formData.name}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
                }
                required />

              <Input label="Last Name" placeholder="Doe" required />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value
              })
              }
              required />


            <Input
              label="Subject"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={(e) =>
              setFormData({
                ...formData,
                subject: e.target.value
              })
              }
              required />


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  message: e.target.value
                })
                }
                required />

            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}>

              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>);

}