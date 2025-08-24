import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Users,
  Star,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  Wrench,
  Truck,
  Heart,
  Building
} from 'lucide-react';

const Jobs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    { id: 'all', name: 'All Jobs', icon: Briefcase },
    { id: 'construction', name: 'Construction', icon: Building },
    { id: 'transport', name: 'Transportation', icon: Truck },
    { id: 'medical', name: 'Medical Support', icon: Heart },
    { id: 'technical', name: 'Technical', icon: Wrench },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Emergency Shelter Construction Helper',
      category: 'construction',
      organization: 'Red Cross Emergency Response',
      location: 'Downtown Relief Zone',
      distance: '1.2 miles',
      duration: '3-5 days',
      stipend: '$120/day',
      urgency: 'high',
      description: 'Help construct temporary shelters for displaced families. No prior construction experience required - training provided.',
      skills: ['Physical Fitness', 'Teamwork', 'Basic Tools'],
      schedule: 'Full-time, 8AM-6PM',
      applicants: 23,
      spots: 15,
      rating: 4.8,
      benefits: ['Meals Provided', 'Safety Equipment', 'Training Certification']
    },
    {
      id: 2,
      title: 'Medical Supply Distribution Coordinator',
      category: 'medical',
      organization: 'Community Health Alliance',
      location: 'Central Medical Station',
      distance: '0.8 miles',
      duration: '2-3 weeks',
      stipend: '$100/day',
      urgency: 'critical',
      description: 'Organize and distribute medical supplies to emergency response teams and evacuation centers.',
      skills: ['Organization', 'Medical Knowledge Preferred', 'Communication'],
      schedule: 'Flexible, 6AM-10PM shifts',
      applicants: 12,
      spots: 8,
      rating: 4.9,
      benefits: ['Flexible Schedule', 'Health Coverage', 'Transportation']
    },
    {
      id: 3,
      title: 'Emergency Transport Driver',
      category: 'transport',
      organization: 'Emergency Logistics Network',
      location: 'Multiple Locations',
      distance: 'Various',
      duration: '1-2 weeks',
      stipend: '$150/day',
      urgency: 'medium',
      description: 'Drive emergency vehicles to transport supplies, personnel, and evacuees. Valid CDL required.',
      skills: ['CDL License', 'Clean Driving Record', 'GPS Navigation'],
      schedule: '12-hour shifts, 24/7 coverage',
      applicants: 8,
      spots: 12,
      rating: 4.7,
      benefits: ['Vehicle Provided', 'Fuel Coverage', 'Insurance']
    },
    {
      id: 4,
      title: 'Tech Support for Emergency Communications',
      category: 'technical',
      organization: 'Digital Emergency Response',
      location: 'Command Center',
      distance: '2.1 miles',
      duration: '1-4 weeks',
      stipend: '$180/day',
      urgency: 'high',
      description: 'Maintain and troubleshoot emergency communication systems including radios, internet, and mobile networks.',
      skills: ['IT Experience', 'Network Troubleshooting', 'Radio Systems'],
      schedule: 'On-call, 24/7 availability',
      applicants: 15,
      spots: 6,
      rating: 4.6,
      benefits: ['Remote Work Options', 'Equipment Provided', 'Skill Development']
    },
    {
      id: 5,
      title: 'Community Outreach Assistant',
      category: 'social',
      organization: 'Local Community Alliance',
      location: 'Neighborhood Centers',
      distance: '0.5 miles',
      duration: '2-6 weeks',
      stipend: '$80/day',
      urgency: 'medium',
      description: 'Help connect displaced families with resources, assist with paperwork, and provide emotional support.',
      skills: ['Communication', 'Empathy', 'Bilingual Preferred'],
      schedule: 'Part-time, flexible hours',
      applicants: 31,
      spots: 20,
      rating: 4.9,
      benefits: ['Training Provided', 'Community Impact', 'Networking']
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-danger bg-danger/20 border-danger/30';
      case 'high': return 'text-warning bg-warning/20 border-warning/30';
      case 'medium': return 'text-accent bg-accent/20 border-accent/30';
      default: return 'text-muted-foreground bg-muted/20 border-muted/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'construction': return Building;
      case 'transport': return Truck;
      case 'medical': return Heart;
      case 'technical': return Wrench;
      default: return Briefcase;
    }
  };

  const filteredJobs = jobs.filter(job => 
    selectedCategory === 'all' || job.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <MagneticCursor />
      <Navigation />
      
      <main className="pt-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-heading mb-2">
                Emergency Response Jobs
              </h1>
              <p className="text-muted-foreground">
                Temporary skill-based opportunities to help with disaster recovery
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary w-64"
                />
              </div>
              <Button variant="outline" size="sm" className="magnetic">
                <Filter size={16} className="mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="magnetic"
              >
                <category.icon size={16} className="mr-2" />
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card neon-border p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">24</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </Card>
          <Card className="glass-card neon-border p-4 text-center">
            <div className="text-2xl font-bold text-success mb-1">156</div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </Card>
          <Card className="glass-card neon-border p-4 text-center">
            <div className="text-2xl font-bold text-warning mb-1">89</div>
            <div className="text-sm text-muted-foreground">People Hired</div>
          </Card>
          <Card className="glass-card neon-border p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">$125</div>
            <div className="text-sm text-muted-foreground">Avg Daily Pay</div>
          </Card>
        </motion.div>

        {/* Jobs List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredJobs.map((job, index) => {
            const IconComponent = getCategoryIcon(job.category);
            
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass-card neon-border p-6 hover:bg-primary/5 transition-all duration-300 magnetic">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          <IconComponent size={24} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold font-heading">{job.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(job.urgency)}`}>
                              {job.urgency} priority
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="font-medium text-foreground">{job.organization}</span>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {job.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              {job.stipend}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {job.benefits.map((benefit) => (
                              <span
                                key={benefit}
                                className="px-2 py-1 bg-success/10 text-success rounded text-xs"
                              >
                                <CheckCircle size={12} className="inline mr-1" />
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel */}
                    <div className="lg:w-80 space-y-4">
                      {/* Stats */}
                      <div className="glass-card rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">{job.applicants}</div>
                            <div className="text-xs text-muted-foreground">Applicants</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-success">{job.spots}</div>
                            <div className="text-xs text-muted-foreground">Open Spots</div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Rating</span>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-warning fill-current" />
                              <span className="text-sm font-medium">{job.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Info */}
                      <div className="glass-card rounded-lg p-4">
                        <h4 className="font-medium mb-2">Schedule</h4>
                        <div className="text-sm text-muted-foreground mb-2">{job.schedule}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          Flexible start date
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <Button className="w-full magnetic bg-gradient-primary">
                          <Briefcase size={16} className="mr-2" />
                          Apply Now
                        </Button>
                        <Button variant="outline" className="w-full magnetic">
                          <Heart size={16} className="mr-2" />
                          Save Job
                        </Button>
                        <Button variant="outline" className="w-full magnetic">
                          <Users size={16} className="mr-2" />
                          Contact Recruiter
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
};

export default Jobs;