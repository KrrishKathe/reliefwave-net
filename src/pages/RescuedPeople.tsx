import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KpiCard } from '@/components/ui/kpi-card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, MapPin, Calendar, Phone, CheckCircle } from 'lucide-react';

interface RescuedPerson {
  id: string;
  title: string;
  people_rescued: number;
  people_affected: number;
  location: any;
  created_at: string;
  status: string;
}

const RescuedPeople = () => {
  const [rescuedData, setRescuedData] = useState<RescuedPerson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalRescued, setTotalRescued] = useState(0);
  const [totalAffected, setTotalAffected] = useState(0);

  useEffect(() => {
    fetchRescuedData();
  }, []);

  const fetchRescuedData = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .gt('people_rescued', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRescuedData(data || []);
      
      // Calculate totals
      const rescued = data?.reduce((sum, incident) => sum + (incident.people_rescued || 0), 0) || 0;
      const affected = data?.reduce((sum, incident) => sum + (incident.people_affected || 0), 0) || 0;
      
      setTotalRescued(rescued);
      setTotalAffected(affected);
    } catch (error) {
      console.error('Error fetching rescued data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = rescuedData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rescueRate = totalAffected > 0 ? Math.round((totalRescued / totalAffected) * 100) : 0;

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
              Rescued People Analytics
            </h1>
            <p className="text-xl text-muted-foreground">
              Track and monitor rescue operations and their outcomes
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KpiCard
              title="Total Rescued"
              value={totalRescued}
              icon={<CheckCircle size={20} />}
              trend="up"
              trendValue="+12%"
              variant="success"
            />
            <KpiCard
              title="Total Affected"
              value={totalAffected}
              icon={<Users size={20} />}
              trend="neutral"
              trendValue="0%"
              variant="warning"
            />
            <KpiCard
              title="Rescue Rate"
              value={`${rescueRate}%`}
              icon={<Users size={20} />}
              trend="up"
              trendValue="+5%"
              variant="success"
            />
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Rescued People Data */}
          <div className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-8 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredData.map((incident) => (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="glass-card neon-border p-6 hover:bg-primary/5 transition-all duration-200 magnetic cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="text-sm font-medium text-success">Rescue Complete</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(incident.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg mb-3">{incident.title}</h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">People Rescued:</span>
                          <span className="font-bold text-success">{incident.people_rescued}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Affected:</span>
                          <span className="font-medium">{incident.people_affected}</span>
                        </div>

                        {incident.location?.address && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span className="truncate">{incident.location.address}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">Rescue Rate:</span>
                          <span className="font-medium text-primary">
                            {Math.round((incident.people_rescued / incident.people_affected) * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MapPin size={14} className="mr-1" />
                          View Location
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone size={14} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filteredData.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No rescued people data found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Rescue data will appear here once operations are completed.'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default RescuedPeople;