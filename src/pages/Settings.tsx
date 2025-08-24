import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Bell, 
  Shield, 
  MapPin, 
  Phone, 
  Mail,
  Globe,
  Database,
  Eye,
  Download,
  Trash2,
  Edit
} from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    emergency: true,
    updates: true,
    sms: true,
    email: false,
    push: true
  });

  const [privacy, setPrivacy] = useState({
    location: true,
    profile: false,
    activity: true
  });

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile Information',
      icon: User,
      description: 'Manage your personal information and emergency contacts'
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: Bell,
      description: 'Control how and when you receive alerts and updates'
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: Shield,
      description: 'Manage your privacy settings and data sharing preferences'
    },
    {
      id: 'location',
      title: 'Location Services',
      icon: MapPin,
      description: 'Configure location sharing for emergency response'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MagneticCursor />
      <Navigation />
      
      <main className="pt-20 px-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold font-heading mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and emergency response settings
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-card neon-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold font-heading">Profile Information</h2>
                  <p className="text-sm text-muted-foreground">Your personal details and emergency contacts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      defaultValue="Alex Rodriguez"
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    <Button variant="outline" size="sm" className="magnetic">
                      <Edit size={16} />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    <option>Volunteer</option>
                    <option>Emergency Contact</option>
                    <option>Professional Responder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-muted-foreground" />
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-muted-foreground" />
                    <input
                      type="email"
                      defaultValue="alex.rodriguez@email.com"
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-4">Emergency Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['First Aid', 'CPR Certified', 'Construction', 'Medical Assistant', 'Driving'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                  <Button variant="outline" size="sm" className="magnetic">
                    + Add Skill
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card neon-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold font-heading">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose how you want to receive alerts and updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Emergency Alerts</div>
                    <div className="text-sm text-muted-foreground">Critical emergency notifications in your area</div>
                  </div>
                  <Switch
                    checked={notifications.emergency}
                    onCheckedChange={(checked) => setNotifications({...notifications, emergency: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive alerts via text message</div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Updates</div>
                    <div className="text-sm text-muted-foreground">Weekly summaries and important updates</div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Browser notifications for real-time updates</div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-card neon-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold font-heading">Privacy & Data</h2>
                  <p className="text-sm text-muted-foreground">Control your privacy settings and data sharing</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Location Sharing</div>
                    <div className="text-sm text-muted-foreground">Share location during emergencies only</div>
                  </div>
                  <Switch
                    checked={privacy.location}
                    onCheckedChange={(checked) => setPrivacy({...privacy, location: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Public Profile</div>
                    <div className="text-sm text-muted-foreground">Make your profile visible to other volunteers</div>
                  </div>
                  <Switch
                    checked={privacy.profile}
                    onCheckedChange={(checked) => setPrivacy({...privacy, profile: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Activity Tracking</div>
                    <div className="text-sm text-muted-foreground">Track your volunteer activities and impact</div>
                  </div>
                  <Switch
                    checked={privacy.activity}
                    onCheckedChange={(checked) => setPrivacy({...privacy, activity: checked})}
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-4">Data Management</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="magnetic">
                    <Download size={16} className="mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="magnetic">
                    <Eye size={16} className="mr-2" />
                    View Data
                  </Button>
                  <Button variant="outline" className="magnetic text-danger hover:bg-danger/10">
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Language & Region */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-card neon-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold font-heading">Language & Region</h2>
                  <p className="text-sm text-muted-foreground">Set your preferred language and location</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Zone</label>
                  <select className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary">
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button className="magnetic bg-gradient-primary px-8">
              Save Changes
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;