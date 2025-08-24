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
  Shield, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  Radio,
  Navigation as NavigationIcon,
  Activity,
  AlertCircle
} from 'lucide-react';

interface RescueTeam {
  id: string;
  name: string;
  status: string;
  location: any;
  assigned_incident_id: string | null;
  eta_minutes: number;
  contact_info: any;
  created_at: string;
}

interface Incident {
  id: string;
  title: string;
  type: string;
  severity: string;
}

const TeamStatus = () => {
  const [teams, setTeams] = useState<RescueTeam[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, incidentsRes] = await Promise.all([
        supabase.from('rescue_teams').select('*').order('name'),
        supabase.from('incidents').select('id, title, type, severity')
      ]);

      if (teamsRes.error) throw teamsRes.error;
      if (incidentsRes.error) throw incidentsRes.error;

      setTeams(teamsRes.data || []);
      setIncidents(incidentsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => {
    if (filter === 'all') return true;
    return team.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'warning';
      case 'available': return 'success';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  const getIncidentTitle = (incidentId: string | null) => {
    if (!incidentId) return null;
    const incident = incidents.find(i => i.id === incidentId);
    return incident?.title || 'Unknown Incident';
  };

  const deployedTeams = teams.filter(t => t.status === 'deployed').length;
  const availableTeams = teams.filter(t => t.status === 'available').length;
  const offlineTeams = teams.filter(t => t.status === 'offline').length;
  const avgResponseTime = teams.length > 0 ? 
    Math.round(teams.reduce((sum, t) => sum + (t.eta_minutes || 0), 0) / teams.length) : 0;

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
              Team Status Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time monitoring of rescue team deployments and availability
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Deployed Teams"
              value={deployedTeams}
              icon={<Shield size={20} />}
              trend="up"
              trendValue="+2"
              variant="warning"
            />
            <KpiCard
              title="Available Teams"
              value={availableTeams}
              icon={<Users size={20} />}
              trend="down"
              trendValue="-1"
              variant="success"
            />
            <KpiCard
              title="Offline Teams"
              value={offlineTeams}
              icon={<AlertCircle size={20} />}
              trend="neutral"
              trendValue="0"
              variant="default"
            />
            <KpiCard
              title="Avg Response Time"
              value={`${avgResponseTime}m`}
              icon={<Clock size={20} />}
              trend="down"
              trendValue="-3m"
              variant="success"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="magnetic"
            >
              All Teams
            </Button>
            <Button
              variant={filter === 'available' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('available')}
              className="magnetic"
            >
              Available
            </Button>
            <Button
              variant={filter === 'deployed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('deployed')}
              className="magnetic"
            >
              Deployed
            </Button>
            <Button
              variant={filter === 'offline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('offline')}
              className="magnetic"
            >
              Offline
            </Button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))
            ) : (
              filteredTeams.map((team) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card neon-border p-6 hover:bg-primary/5 transition-all duration-200 magnetic cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md bg-${getStatusColor(team.status)}/10`}>
                          <Shield className={`w-5 h-5 text-${getStatusColor(team.status)}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Team ID: {team.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(team.status) as any} className="capitalize">
                        {team.status}
                      </Badge>
                    </div>

                    {/* Team Details */}
                    <div className="space-y-3 mb-4">
                      {team.contact_info?.leader && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={14} className="text-muted-foreground" />
                          <span>Leader: {team.contact_info.leader}</span>
                        </div>
                      )}

                      {team.contact_info?.radio && (
                        <div className="flex items-center gap-2 text-sm">
                          <Radio size={14} className="text-muted-foreground" />
                          <span>Radio: {team.contact_info.radio}</span>
                        </div>
                      )}

                      {team.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-muted-foreground" />
                          <span>Last known location</span>
                        </div>
                      )}

                      {team.status === 'deployed' && team.eta_minutes > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-warning" />
                          <span className="text-warning font-medium">
                            ETA: {team.eta_minutes} minutes
                          </span>
                        </div>
                      )}

                      {team.assigned_incident_id && (
                        <div className="flex items-center gap-2 text-sm">
                          <Activity size={14} className="text-primary" />
                          <span className="text-primary">
                            {getIncidentTitle(team.assigned_incident_id)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 magnetic">
                        <Phone size={14} className="mr-2" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 magnetic">
                        <MapPin size={14} className="mr-2" />
                        Track
                      </Button>
                      <Button size="sm" variant="outline" className="magnetic">
                        <NavigationIcon size={14} />
                      </Button>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${getStatusColor(team.status)} animate-pulse`}></div>
                        <span className="text-xs text-muted-foreground">
                          Last update: {new Date(team.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      {team.status === 'deployed' && (
                        <Badge variant="outline" className="text-xs">
                          Active Mission
                        </Badge>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {!loading && filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No teams found</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'No rescue teams have been deployed yet.' 
                  : `No teams with status: ${filter}`
                }
              </p>
            </div>
          )}

          {/* Team Communication Panel */}
          <Card className="glass-card neon-border p-6 mt-8">
            <h2 className="text-2xl font-bold font-heading mb-4">Team Communication</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="magnetic bg-gradient-primary p-6 h-auto flex-col">
                <Radio className="w-8 h-8 mb-2" />
                <span className="font-semibold">Broadcast All Teams</span>
                <span className="text-xs opacity-80">Send message to all active teams</span>
              </Button>
              <Button variant="outline" className="magnetic p-6 h-auto flex-col">
                <Phone className="w-8 h-8 mb-2" />
                <span className="font-semibold">Emergency Contact</span>
                <span className="text-xs opacity-80">Direct line to command center</span>
              </Button>
              <Button variant="outline" className="magnetic p-6 h-auto flex-col">
                <Activity className="w-8 h-8 mb-2" />
                <span className="font-semibold">Status Update</span>
                <span className="text-xs opacity-80">Request status from all teams</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default TeamStatus;