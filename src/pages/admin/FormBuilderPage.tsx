import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';
import { FormField } from '../../types';
export function FormBuilderPage() {
  const { addToast } = useToast();
  const [fields, setFields] = useState<FormField[]>([
  {
    id: '1',
    type: 'text',
    label: 'Full Name',
    required: true
  },
  {
    id: '2',
    type: 'text',
    label: 'Email Address',
    required: true
  }]
  );
  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false
    };
    setFields([...fields, newField]);
  };
  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };
  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((f) =>
      f.id === id ?
      {
        ...f,
        ...updates
      } :
      f
      )
    );
  };
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/forms">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Form</h1>
            <p className="text-gray-500">Design your form structure.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Preview</Button>
          <Button
            leftIcon={<Save className="w-4 h-4" />}
            onClick={() => addToast('Form saved', 'success')}>

            Save Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Input label="Form Title" placeholder="e.g. Feedback Survey" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  rows={2}
                  placeholder="Form description..." />

              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {fields.map((field, index) =>
            <div
              key={field.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm group">

                <div className="flex items-start gap-3">
                  <div className="mt-2 text-gray-400 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                        value={field.label}
                        onChange={(e) =>
                        updateField(field.id, {
                          label: e.target.value
                        })
                        }
                        placeholder="Field Label" />

                      </div>
                      <div className="w-32">
                        <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                        value={field.type}
                        onChange={(e) =>
                        updateField(field.id, {
                          type: e.target.value as any
                        })
                        }>

                          <option value="text">Text</option>
                          <option value="textarea">Text Area</option>
                          <option value="select">Select</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="radio">Radio</option>
                          <option value="date">Date</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                        updateField(field.id, {
                          required: e.target.checked
                        })
                        }
                        className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />

                        Required field
                      </label>
                      <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeField(field.id)}>

                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Add a new field</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {['text', 'textarea', 'select', 'checkbox', 'date'].map(
                  (type) =>
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addField(type as any)}
                    className="capitalize">

                      <Plus className="w-3 h-3 mr-1" /> {type}
                    </Button>

                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Settings */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Form Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-[var(--color-primary)]" />

                  Collect email addresses
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[var(--color-primary)]" />

                  Limit to 1 response
                </label>
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmation Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    rows={3}
                    defaultValue="Thanks for submitting!" />

                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}