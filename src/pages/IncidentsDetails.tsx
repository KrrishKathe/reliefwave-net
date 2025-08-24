import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KpiCard } from '@/components/ui/kpi-card';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  Navigation as NavigationIcon,
  Eye,
  Filter
} from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  location: any;
  people_affected: number;
  people_rescued: number;
  rescue_eta_minutes: number;
  created_at: string;
}

const IncidentsDetails = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.status === filter || incident.severity === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'danger';
      case 'ongoing': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const activeIncidents = incidents.filter(i => i.status === 'active').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  const totalAffected = incidents.reduce((sum, i) => sum + (i.people_affected || 0), 0);
  const avgEta = incidents.length > 0 ? 
    Math.round(incidents.reduce((sum, i) => sum + (i.rescue_eta_minutes || 0), 0) / incidents.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      <MagneticCursor />
      <Navigation />
      
      <main className="pt-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-heading mb-4">
              Active Incidents Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time monitoring and management of emergency situations
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Active Incidents"
              value={activeIncidents}
              icon={<AlertTriangle size={20} />}
              trend="up"
              trendValue="+3"
              variant="emergency"
            />
            <KpiCard
              title="Critical Level"
              value={criticalIncidents}
              icon={<AlertTriangle size={20} />}
              trend="down"
              trendValue="-1"
              variant="warning"
            />
            <KpiCard
              title="People Affected"
              value={totalAffected}
              icon={<Users size={20} />}
              trend="up"
              trendValue="+15"
              variant="warning"
            />
            <KpiCard
              title="Avg Response ETA"
              value={`${avgEta}m`}
              icon={<Clock size={20} />}
              trend="down"
              trendValue="-5m"
              variant="success"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="magnetic"
            >
              All Incidents
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
              className="magnetic"
            >
              Active
            </Button>
            <Button
              variant={filter === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('critical')}
              className="magnetic"
            >
              Critical
            </Button>
            <Button
              variant={filter === 'ongoing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('ongoing')}
              className="magnetic"
            >
              Ongoing
            </Button>
          </div>

          {/* Incidents List */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
                    <div className="h-6 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card neon-border p-6 hover:bg-primary/5 transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <AlertTriangle className={`w-5 h-5 text-${getSeverityColor(incident.severity)}`} />
                          <h3 className="font-semibold text-lg">{incident.title}</h3>
                          <Badge variant={getSeverityColor(incident.severity) as any}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <Badge variant={getStatusColor(incident.status) as any}>
                            {incident.status.toUpperCase()}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-4">{incident.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-muted-foreground" />
                            <span>{incident.people_affected} affected</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-muted-foreground" />
                            <span>{incident.rescue_eta_minutes}m ETA</span>
                          </div>
                          {incident.location?.address && (
                            <div className="flex items-center gap-2 col-span-2">
                              <MapPin size={14} className="text-muted-foreground" />
                              <span className="truncate">{incident.location.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button size="sm" className="magnetic bg-gradient-primary">
                          <Eye size={14} className="mr-2" />
                          View Details
                        </Button>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 magnetic">
                            <MapPin size={14} className="mr-1" />
                            Map
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 magnetic">
                            <NavigationIcon size={14} className="mr-1" />
                            Navigate
                          </Button>
                          <Button size="sm" variant="outline" className="magnetic">
                            <Phone size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
                      <span>Incident ID: {incident.id.slice(0, 8)}</span>
                      <span>Reported: {new Date(incident.created_at).toLocaleString()}</span>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}

            {!loading && filteredIncidents.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No incidents found</h3>
                <p className="text-muted-foreground">
                  {filter === 'all' 
                    ? 'No incidents have been reported yet.' 
                    : `No incidents match the selected filter: ${filter}`
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default IncidentsDetails;