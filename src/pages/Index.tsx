import { Hero3D } from '@/components/ui/hero-3d';
import { Navigation } from '@/components/layout/navigation';
import { MagneticCursor } from '@/components/ui/magnetic-cursor';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MagneticCursor />
      <Navigation />
      <Hero3D />
    </div>
  );
};

export default Index;
