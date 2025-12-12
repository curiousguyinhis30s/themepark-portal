import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Store, Clock, MapPin, Phone, Save, CheckCircle } from 'lucide-react';

export default function StoreSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store information and business details</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>Your store's basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Business Name</label>
              <Input defaultValue={user?.businessName || ''} className="mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                defaultValue={user?.businessCategory || 'Food & Beverage'}
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Food & Beverage</option>
                <option>Retail</option>
                <option>Services</option>
                <option>Entertainment</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                defaultValue="Signature burgers and snacks for hungry park visitors"
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
            <CardDescription>Where customers can find you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Zone</label>
              <select
                defaultValue="Adventure Zone"
                className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Fantasy Kingdom</option>
                <option>Future World</option>
                <option>Aqua Zone</option>
                <option>Kids Paradise</option>
                <option>Adventure Zone</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Stall/Location ID</label>
              <Input defaultValue="Stall A12" className="mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium">Landmarks / Directions</label>
              <Input defaultValue="Near Thunder Rapids exit" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Operating Hours
            </CardTitle>
            <CardDescription>When your store is open</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">Follow Park Hours</span>
              <Badge variant="secondary">Recommended</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Opening Time</label>
                <Input type="time" defaultValue="10:00" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Closing Time</label>
                <Input type="time" defaultValue="22:00" className="mt-1" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Break Time (Optional)</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <Input type="time" placeholder="Start" />
                <Input type="time" placeholder="End" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How park management can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Contact Person</label>
              <Input defaultValue={user?.name || ''} className="mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input type="tel" defaultValue="+60 12-345 6789" className="mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue={user?.email || ''} className="mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saved}>
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
