import React from 'react';
import { Save, Upload } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { useToast } from '../../../components/ui/Toast';
export function BrandingPage() {
  const { addToast } = useToast();
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Branding & Theme</h1>
        <p className="text-gray-500">
          Customize the look and feel of your community hub.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-900">Logo & Identity</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-400 text-xs">Logo Preview</span>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo
              </label>
              <div className="flex gap-3">
                <Input placeholder="https://..." className="flex-1" />
                <Button
                  variant="outline"
                  leftIcon={<Upload className="w-4 h-4" />}>

                  Upload
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Recommended size: 512x512px. PNG or SVG.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-900">Colors</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-10 w-10 rounded cursor-pointer border border-gray-200"
                  defaultValue="#3B82F6" />

                <Input defaultValue="#3B82F6" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Used for buttons, links, and active states.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-10 w-10 rounded cursor-pointer border border-gray-200"
                  defaultValue="#10B981" />

                <Input defaultValue="#10B981" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Used for accents and success states.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="lg"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={() => addToast('Branding saved', 'success')}>

          Save Changes
        </Button>
      </div>
    </div>);

}