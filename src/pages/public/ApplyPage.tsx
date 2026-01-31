import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Briefcase,
  FileText } from
'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
export function ApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occupation: '',
    company: '',
    interests: '',
    reason: ''
  });
  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const nextStep = () => {
    // Basic validation
    if (
    step === 1 && (
    !formData.firstName || !formData.lastName || !formData.email))
    {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    if (step === 2 && (!formData.occupation || !formData.company)) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 2000);
  };
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Received!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for applying to join our community. We have received your
            application and will review it shortly. You will receive an email
            confirmation with next steps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg">Return Home</Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg">
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </div>);

  }
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Membership Application
        </h1>
        <p className="text-gray-500">
          Join our community to access exclusive events, resources, and
          networking opportunities.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>

            1
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>

            2
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>

            3
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 4 ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-500'}`}>

            4
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <span>Personal</span>
          <span>Professional</span>
          <span>Interests</span>
          <span>Review</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-10">
          {/* Step 1: Personal Info */}
          {step === 1 &&
          <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-[var(--color-primary)]">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => updateForm('firstName', e.target.value)}
                placeholder="Jane"
                required />

                <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => updateForm('lastName', e.target.value)}
                placeholder="Doe"
                required />

              </div>
              <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => updateForm('email', e.target.value)}
              placeholder="jane@example.com"
              required />

              <Input
              label="Phone Number (Optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateForm('phone', e.target.value)}
              placeholder="+1 (555) 000-0000" />

            </div>
          }

          {/* Step 2: Professional Info */}
          {step === 2 &&
          <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-[var(--color-primary)]">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Professional Background
                </h2>
              </div>

              <Input
              label="Current Occupation / Role"
              value={formData.occupation}
              onChange={(e) => updateForm('occupation', e.target.value)}
              placeholder="e.g. Product Designer"
              required />

              <Input
              label="Company / Organization"
              value={formData.company}
              onChange={(e) => updateForm('company', e.target.value)}
              placeholder="e.g. Tech Solutions Inc."
              required />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile (Optional)
                </label>
                <input
                type="url"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="https://linkedin.com/in/..." />

              </div>
            </div>
          }

          {/* Step 3: Interests */}
          {step === 3 &&
          <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-[var(--color-primary)]">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Interests & Goals
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to join?
                </label>
                <textarea
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Tell us a bit about what you hope to gain from the community..."
                value={formData.reason}
                onChange={(e) => updateForm('reason', e.target.value)} />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Areas of Interest
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                'Networking',
                'Mentorship',
                'Events',
                'Volunteering',
                'Learning',
                'Leadership'].
                map((interest) =>
                <label
                  key={interest}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">

                      <input
                    type="checkbox"
                    className="mr-3 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />

                      <span className="text-sm font-medium text-gray-700">
                        {interest}
                      </span>
                    </label>
                )}
                </div>
              </div>
            </div>
          }

          {/* Step 4: Review */}
          {step === 4 &&
          <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-[var(--color-primary)]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Review Application
                </h2>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {formData.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Professional
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Occupation</p>
                      <p className="font-medium text-gray-900">
                        {formData.occupation}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">
                        {formData.company}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Motivation
                  </h3>
                  <p className="text-sm text-gray-900 italic">
                    "{formData.reason || 'No specific reason provided.'}"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                <div className="shrink-0 mt-0.5">ℹ️</div>
                <p>
                  By submitting this application, you agree to our Code of
                  Conduct and Terms of Service. Your application will be
                  reviewed by our team within 2-3 business days.
                </p>
              </div>
            </div>
          }
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-between items-center">
          {
          step > 1 ?
          <Button
            variant="ghost"
            onClick={prevStep}
            leftIcon={<ChevronLeft className="w-4 h-4" />}>

                Back
              </Button> :

          <div></div>
          // Spacer
          }

          {step < 4 ?
          <Button
            onClick={nextStep}
            rightIcon={<ChevronRight className="w-4 h-4" />}>

              Continue
            </Button> :

          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="px-8">

              Submit Application
            </Button>
          }
        </div>
      </div>
    </div>);

}