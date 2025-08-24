import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Navigation as NavigationIcon, 
  Phone, 
  Clock,
  Users,
  Wifi,
  Utensils,
  Home,
  Heart,
  Zap,
  Filter,
  Search
} from 'lucide-react';

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const categories = [
    { id: 'all', name: 'All Resources', icon: MapPin },
    { id: 'shelter', name: 'Shelters', icon: Home },
    { id: 'food', name: 'Food & Water', icon: Utensils },
    { id: 'medical', name: 'Medical', icon: Heart },
    { id: 'power', name: 'Power & Charging', icon: Zap },
    { id: 'wifi', name: 'Communication', icon: Wifi },
  ];

  const resources = [
    {
      id: 1,
      name: 'Central Emergency Shelter',
      type: 'shelter',
      description: 'Large capacity emergency shelter with medical facilities',
      location: 'Downtown Community Center',
      distance: '0.8 miles',
      capacity: 200,
      available: 45,
      contact: '+1 (555) 123-4567',
      hours: '24/7',
      amenities: ['Medical Care', 'Food', 'Showers', 'Childcare'],
      status: 'open'
    },
    {
      id: 2,
      name: 'Mobile Food Distribution',
      type: 'food',
      description: 'Free meals and water distribution point',
      location: 'City Park Main Entrance',
      distance: '1.2 miles',
      capacity: 500,
      available: 350,
      contact: '+1 (555) 987-6543',
      hours: '8:00 AM - 8:00 PM',
      amenities: ['Hot Meals', 'Water', 'Snacks', 'Baby Formula'],
      status: 'open'
    },
    {
      id: 3,
      name: 'Emergency Medical Station',
      type: 'medical',
      description: 'First aid and emergency medical treatment',
      location: 'Recreation Center',
      distance: '2.1 miles',
      capacity: 50,
      available: 12,
      contact: '+1 (555) 456-7890',
      hours: '24/7',
      amenities: ['First Aid', 'Medications', 'Trauma Care', 'Mental Health'],
      status: 'busy'
    },
    {
      id: 4,
      name: 'Charging Station Hub',
      type: 'power',
      description: 'Device charging and internet access',
      location: 'Public Library',
      distance: '0.5 miles',
      capacity: 100,
      available: 78,
      contact: '+1 (555) 234-5678',
      hours: '6:00 AM - 10:00 PM',
      amenities: ['Device Charging', 'WiFi', 'Computer Access', 'Phone Service'],
      status: 'open'
    },
    {
      id: 5,
      name: 'Emergency Communication Center',
      type: 'wifi',
      description: 'Free WiFi and phone services for displaced families',
      location: 'Shopping Mall Food Court',
      distance: '1.8 miles',
      capacity: 150,
      available: 89,
      contact: '+1 (555) 345-6789',
      hours: '24/7',
      amenities: ['Free WiFi', 'Phone Calls', 'Internet Access', 'Printing'],
      status: 'open'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-success bg-success/20';
      case 'busy': return 'text-warning bg-warning/20';
      case 'full': return 'text-danger bg-danger/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shelter': return Home;
      case 'food': return Utensils;
      case 'medical': return Heart;
      case 'power': return Zap;
      case 'wifi': return Wifi;
      default: return MapPin;
    }
  };

  const filteredResources = resources.filter(resource => 
    selectedCategory === 'all' || resource.type === selectedCategory
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
                Emergency Resources
              </h1>
              <p className="text-muted-foreground">
                Find nearby shelters, food, medical care, and essential services
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
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
            <div className="text-2xl font-bold text-success mb-1">8</div>
            <div className="text-sm text-muted-foreground">Open Shelters</div>
          </Card>
          <Card className="glass-card neon-border p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">12</div>
            <div className="text-sm text-muted-foreground">Food Centers</div>
          </Card>
          <Card className="glass-card neon-border p-4 text-center">
            <div className="text-2xl font-bold text-warning mb-1">5</div>
            <div className="text-sm text-muted-foreground">Medical Stations</div>
          </Card>
          <Card className="glass-card neon-border p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">Emergency Line</div>
          </Card>
        </motion.div>

        {/* Resources List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredResources.map((resource, index) => {
            const IconComponent = getTypeIcon(resource.type);
            
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass-card neon-border p-6 hover:bg-primary/5 transition-all duration-300 magnetic">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Icon and Main Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <IconComponent size={24} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold font-heading">{resource.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(resource.status)}`}>
                            {resource.status}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{resource.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {resource.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <NavigationIcon size={14} />
                            {resource.distance}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {resource.available}/{resource.capacity} available
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {resource.hours}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {resource.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="px-2 py-1 bg-muted/20 text-muted-foreground rounded text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      <Button className="magnetic bg-gradient-primary">
                        <NavigationIcon size={16} className="mr-2" />
                        Get Directions
                      </Button>
                      <Button variant="outline" className="magnetic">
                        <Phone size={16} className="mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" className="magnetic">
                        <MapPin size={16} className="mr-2" />
                        View on Map
                      </Button>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Capacity</span>
                      <span className="text-sm font-medium">
                        {Math.round((resource.available / resource.capacity) * 100)}% available
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-success to-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(resource.available / resource.capacity) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
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

export default Resources;