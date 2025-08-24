import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Card } from '@/components/ui/card';
import { KpiCard } from '@/components/ui/kpi-card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Clock, MapPin, Users, Truck, AlertTriangle, Timer } from 'lucide-react';

interface RescueTeam {
  id: string;
  name: string;
  status: string;
  location: any;
  eta_minutes: number;
  contact_info: any;
}

interface Incident {
  id: string;
  title: string;
  rescue_eta_minutes: number;
  people_affected: number;
  location: any;
  severity: string;
}

const EtaDetails = () => {
  const [teams, setTeams] = useState<RescueTeam[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsResponse, incidentsResponse] = await Promise.all([
        supabase.from('rescue_teams').select('*').order('eta_minutes', { ascending: true }),
        supabase.from('incidents').select('*').eq('status', 'active').order('rescue_eta_minutes', { ascending: true })
      ]);

      if (teamsResponse.error) throw teamsResponse.error;
      if (incidentsResponse.error) throw incidentsResponse.error;

      setTeams(teamsResponse.data || []);
      setIncidents(incidentsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deployedTeams = teams.filter(t => t.status === 'deployed');
  const availableTeams = teams.filter(t => t.status === 'available');
  const avgEta = incidents.length > 0 ? 
    Math.round(incidents.reduce((sum, i) => sum + (i.rescue_eta_minutes || 0), 0) / incidents.length) : 0;
  const shortestEta = incidents.length > 0 ? 
    Math.min(...incidents.map(i => i.rescue_eta_minutes || 999)) : 0;

  const getEtaColor = (eta: number) => {
    if (eta <= 10) return 'text-success';
    if (eta <= 30) return 'text-warning';
    return 'text-danger';
  };

  const getEtaProgress = (eta: number) => {
    const maxEta = 60; // 60 minutes max
    return Math.max(0, 100 - (eta / maxEta) * 100);
  };

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
              Response Time Analytics
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitor estimated arrival times and response efficiency
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Average ETA"
              value={`${avgEta}m`}
              icon={<Clock size={20} />}
              trend="down"
              trendValue="-3m"
              variant="success"
            />
            <KpiCard
              title="Shortest ETA"
              value={`${shortestEta}m`}
              icon={<Timer size={20} />}
              trend="down"
              trendValue="-2m"
              variant="success"
            />
            <KpiCard
              title="Deployed Teams"
              value={deployedTeams.length}
              icon={<Truck size={20} />}
              trend="up"
              trendValue="+2"
              variant="warning"
            />
            <KpiCard
              title="Available Teams"
              value={availableTeams.length}
              icon={<Users size={20} />}
              trend="neutral"
              trendValue="0"
              variant="default"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Incidents ETA */}
            <div>
              <h2 className="text-2xl font-bold font-heading mb-4">Incident Response Times</h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-6 bg-muted rounded"></div>
                    </div>
                  ))
                ) : (
                  incidents.map((incident) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="glass-card neon-border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold truncate flex-1 mr-4">{incident.title}</h3>
                          <div className={`text-2xl font-bold ${getEtaColor(incident.rescue_eta_minutes)}`}>
                            {incident.rescue_eta_minutes}m
                          </div>
                        </div>
                        
                        <Progress 
                          value={getEtaProgress(incident.rescue_eta_minutes)} 
                          className="mb-3"
                        />
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            <span>{incident.people_affected} affected</span>
                          </div>
                          {incident.location?.address && (
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span className="truncate max-w-32">{incident.location.address}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Rescue Teams Status */}
            <div>
              <h2 className="text-2xl font-bold font-heading mb-4">Team Response Status</h2>
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-6 bg-muted rounded"></div>
                    </div>
                  ))
                ) : (
                  teams.map((team) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="glass-card neon-border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Truck className={`w-5 h-5 ${
                              team.status === 'deployed' ? 'text-warning' : 
                              team.status === 'available' ? 'text-success' : 'text-muted-foreground'
                            }`} />
                            <div>
                              <h3 className="font-semibold">{team.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">{team.status}</p>
                            </div>
                          </div>
                          
                          {team.status === 'deployed' && (
                            <div className={`text-lg font-bold ${getEtaColor(team.eta_minutes)}`}>
                              {team.eta_minutes}m
                            </div>
                          )}
                        </div>

                        {team.status === 'deployed' && (
                          <Progress 
                            value={getEtaProgress(team.eta_minutes)} 
                            className="mb-3"
                          />
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Radio: {team.contact_info?.radio || 'N/A'}</span>
                          <span>Leader: {team.contact_info?.leader || 'N/A'}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ETA Distribution Chart */}
          <div className="mt-8">
            <Card className="glass-card neon-border p-6">
              <h2 className="text-2xl font-bold font-heading mb-4">Response Time Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">
                    {incidents.filter(i => i.rescue_eta_minutes <= 10).length}
                  </div>
                  <div className="text-sm text-muted-foreground">≤ 10 minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">
                    {incidents.filter(i => i.rescue_eta_minutes > 10 && i.rescue_eta_minutes <= 30).length}
                  </div>
                  <div className="text-sm text-muted-foreground">11-30 minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-danger mb-2">
                    {incidents.filter(i => i.rescue_eta_minutes > 30 && i.rescue_eta_minutes <= 60).length}
                  </div>
                  <div className="text-sm text-muted-foreground">31-60 minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-danger mb-2">
                    {incidents.filter(i => i.rescue_eta_minutes > 60).length}
                  </div>
                  <div className="text-sm text-muted-foreground">&gt; 60 minutes</div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default EtaDetails;