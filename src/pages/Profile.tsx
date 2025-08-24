import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Lock, 
  Mail, 
  Phone, 
  Edit3,
  Save,
  Calendar,
  Award,
  MapIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  age: number;
  phone: string;
  location: any;
  skills: string[];
  role: string;
  created_at: string;
}

interface SavedJob {
  id: string;
  job_id: string;
  jobs: {
    title: string;
    company: string;
    work_type: string;
    location: any;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    phone: '',
    location: '',
    skills: [] as string[]
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSavedJobs();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        age: data.age?.toString() || '',
        phone: data.phone || '',
        location: (data.location as any)?.address || '',
        skills: data.skills || []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          job_id,
          jobs (
            title,
            company,
            work_type,
            location
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          age: formData.age ? parseInt(formData.age) : null,
          phone: formData.phone,
          location: formData.location ? { address: formData.location } : null,
          skills: formData.skills
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MagneticCursor />
      <Navigation />
      
      <main className="pt-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-heading mb-4">My Profile</h1>
            <p className="text-xl text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="glass-card neon-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-heading">Personal Information</h2>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    className="magnetic"
                  >
                    {isEditing ? (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 size={16} className="mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      {isEditing ? (
                        <Input
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-lg">{profile?.full_name || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Username</label>
                      <p className="text-lg text-muted-foreground">@{profile?.username}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Age</label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                          placeholder="Enter your age"
                        />
                      ) : (
                        <p className="text-lg">{profile?.age || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      {isEditing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <p className="text-lg">{profile?.phone || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    {isEditing ? (
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your location"
                      />
                    ) : (
                      <p className="text-lg">{(profile?.location as any)?.address || 'Not set'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer">
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-xs hover:text-red-500"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSkill(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addSkill(input.value);
                            input.value = '';
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Account Settings */}
              <Card className="glass-card neon-border p-6 mt-6">
                <h2 className="text-2xl font-bold font-heading mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Address</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="magnetic">
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="magnetic">
                      Change
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Stats */}
              <Card className="glass-card neon-border p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="font-medium">
                      {profile ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <Badge variant="outline" className="capitalize">
                      {profile?.role || 'User'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Skills</span>
                    <span className="font-medium">{profile?.skills?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Saved Jobs</span>
                    <span className="font-medium">{savedJobs.length}</span>
                  </div>
                </div>
              </Card>

              {/* Saved Jobs */}
              <Card className="glass-card neon-border p-6">
                <h3 className="text-lg font-semibold mb-4">Saved Jobs</h3>
                {savedJobs.length > 0 ? (
                  <div className="space-y-3">
                    {savedJobs.slice(0, 3).map((savedJob) => (
                      <div key={savedJob.id} className="p-3 border border-border rounded-lg">
                        <h4 className="font-medium text-sm">{savedJob.jobs.title}</h4>
                        <p className="text-xs text-muted-foreground">{savedJob.jobs.company}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {savedJob.jobs.work_type}
                        </Badge>
                      </div>
                    ))}
                    {savedJobs.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All ({savedJobs.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No saved jobs yet</p>
                )}
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;