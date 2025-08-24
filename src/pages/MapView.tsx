import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, 
  Layers, 
  Satellite, 
  Users, 
  AlertTriangle,
  Shield,
  Navigation as NavigationIcon,
  Phone,
  Eye
} from 'lucide-react';

interface MapItem {
  id: string;
  title: string;
  type: string;
  location: any;
  status?: string;
  severity?: string;
  people_affected?: number;
  category: 'incident' | 'team' | 'resource';
}

const MapView = () => {
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const [satelliteView, setSatelliteView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const [incidentsRes, teamsRes, resourcesRes] = await Promise.all([
        supabase.from('incidents').select('*'),
        supabase.from('rescue_teams').select('*'),
        supabase.from('resources').select('*')
      ]);

      const incidents = (incidentsRes.data || []).map(item => ({
        ...item,
        category: 'incident' as const
      }));

      const teams = (teamsRes.data || []).map(item => ({
        ...item,
        title: item.name,
        type: 'team',
        category: 'team' as const
      }));

      const resources = (resourcesRes.data || []).map(item => ({
        ...item,
        title: item.name,
        category: 'resource' as const
      }));

      setMapItems([...incidents, ...teams, ...resources]);
    } catch (error) {
      console.error('Error fetching map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = mapItems.filter(item => {
    if (activeLayer === 'all') return true;
    return item.category === activeLayer;
  });

  const getItemIcon = (item: MapItem) => {
    switch (item.category) {
      case 'incident':
        return <AlertTriangle className="w-4 h-4" />;
      case 'team':
        return <Shield className="w-4 h-4" />;
      case 'resource':
        return <MapPin className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getItemColor = (item: MapItem) => {
    if (item.category === 'incident') {
      switch (item.severity) {
        case 'critical': return 'text-danger border-danger';
        case 'high': return 'text-warning border-warning';
        case 'medium': return 'text-primary border-primary';
        case 'low': return 'text-success border-success';
        default: return 'text-muted-foreground border-muted';
      }
    }
    if (item.category === 'team') {
      switch (item.status) {
        case 'deployed': return 'text-warning border-warning';
        case 'available': return 'text-success border-success';
        default: return 'text-muted-foreground border-muted';
      }
    }
    return 'text-primary border-primary';
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
              Live Situation Map
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time visualization of incidents, teams, and resources
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Controls */}
            <div className="lg:col-span-1">
              <Card className="glass-card neon-border p-6">
                <h2 className="text-lg font-semibold mb-4">Map Controls</h2>
                
                {/* Layer Toggle */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Layers</h3>
                  <Button
                    variant={activeLayer === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveLayer('all')}
                    className="w-full justify-start magnetic"
                  >
                    <Layers size={16} className="mr-2" />
                    All Items
                  </Button>
                  <Button
                    variant={activeLayer === 'incident' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveLayer('incident')}
                    className="w-full justify-start magnetic"
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Incidents
                  </Button>
                  <Button
                    variant={activeLayer === 'team' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveLayer('team')}
                    className="w-full justify-start magnetic"
                  >
                    <Shield size={16} className="mr-2" />
                    Teams
                  </Button>
                  <Button
                    variant={activeLayer === 'resource' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveLayer('resource')}
                    className="w-full justify-start magnetic"
                  >
                    <MapPin size={16} className="mr-2" />
                    Resources
                  </Button>
                </div>

                {/* View Toggle */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">View</h3>
                  <Button
                    variant={satelliteView ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSatelliteView(!satelliteView)}
                    className="w-full justify-start magnetic"
                  >
                    <Satellite size={16} className="mr-2" />
                    Satellite View
                  </Button>
                </div>

                {/* Legend */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Legend</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-danger"></div>
                      <span>Critical Incident</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <span>Active/Deployed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span>Safe/Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span>Resource/Service</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map Area */}
            <div className="lg:col-span-3">
              <Card className="glass-card neon-border p-6 h-[600px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Interactive Map</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="magnetic">
                      <NavigationIcon size={16} className="mr-2" />
                      Center Map
                    </Button>
                    <Button size="sm" variant="outline" className="magnetic">
                      <Eye size={16} className="mr-2" />
                      Full Screen
                    </Button>
                  </div>
                </div>

                {/* Placeholder Map */}
                <div className={`w-full h-full rounded-lg relative overflow-hidden ${
                  satelliteView ? 'bg-slate-800' : 'bg-slate-100'
                }`}>
                  {/* Map Grid */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="border border-current opacity-30"></div>
                      ))}
                    </div>
                  </div>

                  {/* Map Items */}
                  <div className="absolute inset-0">
                    {filteredItems.slice(0, 20).map((item, index) => {
                      const x = (index % 8) * 12.5 + 6.25; // Distribute across width
                      const y = Math.floor(index / 8) * 16.67 + 8.33; // Distribute across height
                      
                      return (
                        <div
                          key={item.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                          style={{ left: `${x}%`, top: `${y}%` }}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 ${getItemColor(item)} bg-background/90 flex items-center justify-center hover:scale-125 transition-transform`}>
                            {getItemIcon(item)}
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="glass-card px-3 py-2 text-xs whitespace-nowrap">
                              <div className="font-medium">{item.title}</div>
                              {item.location?.address && (
                                <div className="text-muted-foreground">{item.location.address}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Map Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="glass-card px-3 py-2 text-sm">
                      <div className="font-medium">Map Simulation</div>
                      <div className="text-muted-foreground text-xs">
                        Showing {filteredItems.length} items
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Map Items List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold font-heading mb-4">Map Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </div>
                ))
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="glass-card neon-border p-4 hover:bg-primary/5 transition-colors magnetic cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${getItemColor(item)} bg-current/10`}>
                            {getItemIcon(item)}
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.category}
                          </Badge>
                        </div>
                        {item.severity && (
                          <Badge variant="outline" className={`text-xs ${getItemColor(item)}`}>
                            {item.severity}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      
                      {item.location?.address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin size={14} />
                          <span className="truncate">{item.location.address}</span>
                        </div>
                      )}

                      {item.people_affected && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Users size={14} />
                          <span>{item.people_affected} people affected</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <NavigationIcon size={14} className="mr-1" />
                          Navigate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone size={14} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MapView;