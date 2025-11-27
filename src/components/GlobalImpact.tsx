import { useState, useEffect } from "react";
import { Globe, TrendingUp, Users, Leaf } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const GlobalImpact = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Key global statistics
  const globalStats = [
    {
      icon: Leaf,
      title: "Food Waste",
      value: 1300000000, // 1.3 billion tons
      suffix: " tons",
      description: "of food wasted annually"
    },
    {
      icon: Users,
      title: "People Hungry",
      value: 820000000, // 820 million people
      suffix: "",
      description: "suffer from hunger globally"
    },
    {
      icon: TrendingUp,
      title: "CO2 Emissions",
      value: 3300000000, // 3.3 billion tons
      suffix: " tons",
      description: "from food waste"
    },
    {
      icon: Globe,
      title: "Water Wasted",
      value: 250000000000, // 250 billion cubic meters
      suffix: " m³",
      description: "used for wasted food"
    }
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-background to-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The Global Challenge 🌍
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Understanding the scale helps us appreciate the impact of solutions like Zinova
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`
                  bg-card border border-border rounded-lg p-4
                  transition-all duration-700 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 mr-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{stat.title}</h3>
                </div>
                
                <div className="mb-1">
                  <span className="text-xl font-bold text-primary">
                    <AnimatedCounter 
                      target={stat.value} 
                      suffix={stat.suffix} 
                      duration={2000} 
                    />
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalImpact;