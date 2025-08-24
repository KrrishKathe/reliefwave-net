import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { KpiCard } from '@/components/ui/kpi-card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  MapPin,
  Radio,
  Heart,
  Zap,
  Filter,
  Search,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const kpiData = [
    {
      title: 'People Rescued',
      value: '247',
      subtitle: 'Last 24 hours',
      icon: <Users size={20} />,
      trend: 'up' as const,
      trendValue: '+12%',
      variant: 'success' as const
    },
    {
      title: 'Active Incidents',
      value: '12',
      subtitle: '3 critical priority',
      icon: <AlertTriangle size={20} />,
      trend: 'down' as const,
      trendValue: '-8%',
      variant: 'warning' as const
    },
    {
      title: 'Average ETA',
      value: '18m',
      subtitle: 'Response time',
      icon: <Clock size={20} />,
      trend: 'down' as const,
      trendValue: '-3m',
      variant: 'success' as const
    },
    {
      title: 'Impact Score',
      value: '74%',
      subtitle: 'Disaster severity',
      icon: <TrendingUp size={20} />,
      trend: 'neutral' as const,
      trendValue: 'Stable',
      variant: 'emergency' as const
    }
  ];

  const activeIncidents = [
    {
      id: 1,
      title: 'Flood in Downtown District',
      severity: 'critical',
      location: 'Downtown, Sector 7',
      victims: 23,
      eta: '12m',
      teams: 3,
      status: 'en-route'
    },
    {
      id: 2,
      title: 'Building Collapse',
      severity: 'high',
      location: 'Industrial Zone B',
      victims: 8,
      eta: '25m',
      teams: 2,
      status: 'assigned'
    },
    {
      id: 3,
      title: 'Wildfire Spread',
      severity: 'medium',
      location: 'Forest Hills',
      victims: 45,
      eta: '35m',
      teams: 4,
      status: 'monitoring'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-danger bg-danger/20';
      case 'high': return 'text-warning bg-warning/20';
      case 'medium': return 'text-accent bg-accent/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en-route': return 'text-warning bg-warning/20';
      case 'assigned': return 'text-primary bg-primary/20';
      case 'monitoring': return 'text-accent bg-accent/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

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
                Operations Dashboard
              </h1>
              <p className="text-muted-foreground">
                Real-time disaster response coordination center
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="magnetic">
                <Bell size={16} className="mr-2" />
                Alerts
              </Button>
              <Button size="sm" className="magnetic bg-gradient-primary">
                <Radio size={16} className="mr-2" />
                Broadcast
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <KpiCard {...kpi} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incidents Table */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass-card neon-border rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold font-heading">
                    Active Incidents
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search incidents..."
                        className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="magnetic">
                      <Filter size={16} className="mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {activeIncidents.map((incident, index) => (
                  <motion.div
                    key={incident.id}
                    className="p-6 hover:bg-primary/5 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{incident.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {incident.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {incident.victims} victims
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield size={14} />
                            {incident.teams} teams
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">ETA</div>
                          <div className="text-lg font-bold text-primary">{incident.eta}</div>
                        </div>
                        <Button size="sm" variant="outline" className="magnetic">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Quick Actions */}
            <div className="glass-card neon-border rounded-lg p-6">
              <h3 className="text-lg font-semibold font-heading mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full magnetic bg-gradient-primary">
                  <AlertTriangle size={16} className="mr-2" />
                  Create Incident
                </Button>
                <Button variant="outline" className="w-full magnetic">
                  <MapPin size={16} className="mr-2" />
                  View Map
                </Button>
                <Button variant="outline" className="w-full magnetic">
                  <Radio size={16} className="mr-2" />
                  Team Status
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="glass-card neon-border rounded-lg p-6">
              <h3 className="text-lg font-semibold font-heading mb-4">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-success" />
                    <span className="text-sm">GPS Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-xs text-success">Online</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio size={16} className="text-success" />
                    <span className="text-sm">Communications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-xs text-success">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-warning" />
                    <span className="text-sm">AI Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                    <span className="text-xs text-warning">Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;