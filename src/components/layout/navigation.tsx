import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  LifeBuoy, 
  MapPin, 
  Briefcase, 
  Settings, 
  Shield,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Emergency SOS', href: '/sos', icon: LifeBuoy },
  { name: 'Resources', href: '/resources', icon: MapPin },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return (
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-full px-6 py-3 flex items-center justify-between">
            <Link to="/" className="font-bold text-xl font-heading magnetic">
              ReliefNet
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="magnetic px-4 py-2 text-sm rounded-full hover:bg-primary/10 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="magnetic hidden md:inline-flex">
                Sign In
              </Button>
              <Button size="sm" className="magnetic">
                Get Started
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden magnetic"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden mt-4 max-w-7xl mx-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card rounded-lg p-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 space-y-2">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl font-heading magnetic flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            ReliefNet
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`magnetic px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-neon' 
                      : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 glass-card px-3 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              System Online
            </div>
            
            <Button variant="ghost" size="sm" className="magnetic">
              Profile
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}