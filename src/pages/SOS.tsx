import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Phone, 
  MapPin, 
  Camera, 
  Mic, 
  Users, 
  AlertTriangle,
  Zap,
  Clock,
  Shield,
  Heart
} from 'lucide-react';

const SOS = () => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [peopleCount, setPeopleCount] = useState(1);

  const handleEmergencyCall = () => {
    setIsEmergency(true);
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const emergencyTypes = [
    { type: 'Medical Emergency', icon: Heart, color: 'danger' },
    { type: 'Natural Disaster', icon: AlertTriangle, color: 'warning' },
    { type: 'Fire Emergency', icon: Zap, color: 'danger' },
    { type: 'Security Threat', icon: Shield, color: 'primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MagneticCursor />
      <Navigation />
      
      <main className="pt-20 px-6 max-w-4xl mx-auto">
        {!isEmergency ? (
          // Emergency Call Interface
          <motion.div
            className="flex flex-col items-center justify-center min-h-[80vh]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-danger to-warning rounded-full flex items-center justify-center mx-auto mb-6 relative"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                    '0 0 40px rgba(239, 68, 68, 0.6)',
                    '0 0 20px rgba(239, 68, 68, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle size={48} className="text-white" />
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
              </motion.div>
              
              <h1 className="text-4xl font-bold font-heading mb-4">
                Emergency Response
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Press the emergency button below to immediately alert response teams and share your location.
              </p>
            </div>

            <motion.button
              onClick={handleEmergencyCall}
              className="w-48 h-48 bg-gradient-to-br from-danger to-warning rounded-full flex items-center justify-center text-white font-bold text-2xl font-heading shadow-intense hover:shadow-neon transition-all duration-300 mb-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  '0 20px 40px rgba(239, 68, 68, 0.4)',
                  '0 25px 50px rgba(239, 68, 68, 0.6)',
                  '0 20px 40px rgba(239, 68, 68, 0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-center">
                <Phone size={48} className="mx-auto mb-2" />
                <div>EMERGENCY</div>
                <div className="text-lg">SOS</div>
              </div>
            </motion.button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
              {emergencyTypes.map((emergency, index) => (
                <motion.div
                  key={emergency.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="glass-card neon-border p-4 text-center hover:bg-primary/5 transition-colors cursor-pointer magnetic">
                    <emergency.icon size={24} className={`mx-auto mb-2 text-${emergency.color}`} />
                    <div className="text-sm font-medium">{emergency.type}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 glass-card rounded-lg p-6 max-w-md w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="font-semibold mb-4 text-center">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">People in danger:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{peopleCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPeopleCount(peopleCount + 1)}
                      className="w-8 h-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location sharing:</span>
                  <span className="text-success">Enabled</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response time:</span>
                  <span className="text-primary font-medium">~15 minutes</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Emergency Submitted Interface
          <motion.div
            className="flex flex-col items-center justify-center min-h-[80vh]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 bg-success rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Shield size={32} className="text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold font-heading mb-4 text-center">
              Help is on the way!
            </h1>
            
            <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
              Your emergency signal has been sent. Response teams have been notified and are en route to your location.
            </p>

            <div className="glass-card neon-border rounded-lg p-6 max-w-md w-full mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-success font-medium">Signal Sent</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated ETA:</span>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-primary" />
                    <span className="text-primary font-medium">12-18 minutes</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">People:</span>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{peopleCount} person{peopleCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                {location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-success" />
                      <span className="text-success text-sm">Shared</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="magnetic bg-gradient-primary">
                <Phone size={16} className="mr-2" />
                Call Emergency Line
              </Button>
              <Button variant="outline" className="magnetic">
                <Camera size={16} className="mr-2" />
                Share Photos
              </Button>
              <Button variant="outline" className="magnetic">
                <Mic size={16} className="mr-2" />
                Voice Note
              </Button>
            </div>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <p className="text-sm text-muted-foreground">
                Emergency ID: <span className="font-mono text-primary">#EMG-{Date.now().toString().slice(-6)}</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SOS;