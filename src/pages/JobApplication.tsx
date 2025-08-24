import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Send,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: any;
  work_type: string;
  skills_required: string[];
  salary_range: string;
  created_at: string;
}

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_age: '',
    work_time_preference: '',
    cover_letter: ''
  });

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast({
        title: "Error",
        description: "Could not load job details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !job) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: job.id,
          applicant_id: user.id,
          applicant_name: formData.applicant_name,
          applicant_age: formData.applicant_age ? parseInt(formData.applicant_age) : null,
          work_time_preference: formData.work_time_preference,
          cover_letter: formData.cover_letter
        });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your job application has been sent successfully."
      });

      navigate('/jobs');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <MagneticCursor />
        <Navigation />
        <main className="pt-20 px-6 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Job not found</h3>
            <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')} className="magnetic">
              <ArrowLeft size={16} className="mr-2" />
              Back to Jobs
            </Button>
          </div>
        </main>
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
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/jobs')}
              className="magnetic mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Jobs
            </Button>
            
            <h1 className="text-4xl font-bold font-heading mb-4">
              Apply for Position
            </h1>
            <p className="text-xl text-muted-foreground">
              Submit your application for this emergency response role
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Job Details */}
            <div>
              <Card className="glass-card neon-border p-6">
                <h2 className="text-2xl font-bold font-heading mb-4">Job Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="capitalize">{job.work_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-muted-foreground" />
                      <span>{job.salary_range}</span>
                    </div>
                    {job.location?.address && (
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin size={16} className="text-muted-foreground" />
                        <span>{job.location.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 col-span-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground text-sm">{job.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills_required.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Application Form */}
            <div>
              <Card className="glass-card neon-border p-6">
                <h2 className="text-2xl font-bold font-heading mb-4">Application Form</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.applicant_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Age
                    </label>
                    <Input
                      type="number"
                      value={formData.applicant_age}
                      onChange={(e) => setFormData(prev => ({ ...prev, applicant_age: e.target.value }))}
                      placeholder="Enter your age"
                      min="16"
                      max="80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Work Time Preference <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.work_time_preference}
                      onChange={(e) => setFormData(prev => ({ ...prev, work_time_preference: e.target.value }))}
                      className="w-full p-3 border border-border rounded-md bg-background"
                      required
                    >
                      <option value="">Select preference</option>
                      <option value="morning">Morning Shift (6 AM - 2 PM)</option>
                      <option value="afternoon">Afternoon Shift (2 PM - 10 PM)</option>
                      <option value="night">Night Shift (10 PM - 6 AM)</option>
                      <option value="flexible">Flexible / Any Time</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="emergency">Emergency Response Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cover Letter / Why are you interested?
                    </label>
                    <Textarea
                      value={formData.cover_letter}
                      onChange={(e) => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                      placeholder="Tell us why you're interested in this position and what makes you a good fit..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || !formData.applicant_name || !formData.work_time_preference}
                    className="w-full magnetic bg-gradient-primary"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this application, you agree to be contacted regarding this position.
                  </p>
                </form>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default JobApplication;