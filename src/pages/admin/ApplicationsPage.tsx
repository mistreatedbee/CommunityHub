import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Application } from '../../types';
export function ApplicationsPage() {
  // Mock Data
  const applications: Application[] = [
  {
    id: '1',
    userId: 'temp1',
    applicantName: 'Sarah Connor',
    applicantEmail: 'sarah@example.com',
    status: 'pending',
    submittedAt: '2024-03-10T10:00:00Z',
    personalInfo: {
      occupation: 'Software Engineer',
      company: 'Tech Corp'
    },
    contactInfo: {},
    background: {}
  },
  {
    id: '2',
    userId: 'temp2',
    applicantName: 'Kyle Reese',
    applicantEmail: 'kyle@example.com',
    status: 'pending',
    submittedAt: '2024-03-09T15:30:00Z',
    personalInfo: {
      occupation: 'Security Consultant',
      company: 'Self-employed'
    },
    contactInfo: {},
    background: {}
  },
  {
    id: '3',
    userId: 'temp3',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    status: 'info_requested',
    submittedAt: '2024-03-08T09:15:00Z',
    personalInfo: {
      occupation: 'Student',
      company: 'University'
    },
    contactInfo: {},
    background: {}
  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Membership Applications
          </h1>
          <p className="text-gray-500">
            Review and approve new member requests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) =>
        <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {app.applicantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {app.applicantName}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {app.applicantEmail}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Applied {new Date(app.submittedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {app.personalInfo.occupation}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Badge
                  variant={
                  app.status === 'info_requested' ? 'warning' : 'info'
                  }
                  className="mr-2">

                    {app.status === 'info_requested' ?
                  'Info Requested' :
                  'Pending Review'}
                  </Badge>
                  <Link to={`/admin/applications/${app.id}`}>
                    <Button>Review Application</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {applications.length === 0 &&
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No pending applications
            </h3>
            <p className="text-gray-500">
              Great job! You've reviewed all pending applications.
            </p>
          </div>
        }
      </div>
    </div>);

}