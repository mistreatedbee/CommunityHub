import React from 'react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">About the Movement</h1>
        <p className="text-gray-600 leading-relaxed">
          Community Hub supports real-world community programs by connecting residents, ambassadors, supervisors, and administrators on one secure platform.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="p-5 rounded-xl border border-gray-200 bg-white">
          <h2 className="font-semibold text-gray-900 mb-2">Community First</h2>
          <p className="text-sm text-gray-600">Programs and services are built around local needs and measurable outcomes.</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 bg-white">
          <h2 className="font-semibold text-gray-900 mb-2">Field Ready</h2>
          <p className="text-sm text-gray-600">Supports ambassadors and staff collecting structured data from real community interactions.</p>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 bg-white">
          <h2 className="font-semibold text-gray-900 mb-2">Accountable</h2>
          <p className="text-sm text-gray-600">Role-based access, auditability, and clear reporting help teams make trusted decisions.</p>
        </div>
      </section>
    </div>
  );
}
