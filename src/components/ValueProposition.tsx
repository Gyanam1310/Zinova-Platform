import { VALUE_PROPOSITIONS } from "@/lib/config";
import { Leaf, Zap, Shield, Heart } from "lucide-react";

// Map icon names to actual components
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Leaf,
  Zap,
  Shield,
  Heart
};

const ValueProposition = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose Zinova? 🤔
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our unique approach combines technology, sustainability, and community impact
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUE_PROPOSITIONS.map((value, index) => {
            const IconComponent = iconMap[value.icon];
            return (
              <div 
                key={index} 
                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  {IconComponent && <IconComponent className="h-8 w-8 text-primary" />}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;