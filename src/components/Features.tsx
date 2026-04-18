import { motion } from "framer-motion";
import { Zap, Shield, Heart, Smartphone, Globe, BarChart3 } from "lucide-react";

const FEATURES_DATA = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "AI Optimization",
    description: "Smart matching algorithms that connect surplus food with those who need it most in real-time.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Logistics",
    description: "End-to-end encrypted tracking for every donation, ensuring transparency and safety.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Impact First",
    description: "Every action on our platform is designed to maximize social and environmental impact.",
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile Ready",
    description: "Manage donations, track deliveries, and view reports on the go with our responsive app.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Sustainability",
    description: "Reducing carbon footprint by preventing food from reaching landfills and lowering emissions.",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Detailed Insights",
    description: "Comprehensive dashboards that show your contribution and the impact you're making.",
    color: "bg-purple-500/10 text-purple-500",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold uppercase tracking-widest text-primary"
          >
            Core Capabilities
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Innovative Solutions for a Greener Planet
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES_DATA.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-3xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className={`mb-6 inline-flex p-3 rounded-2xl ${feature.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES } from "@/lib/config";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { 
  Brain, 
  Shield, 
  Map, 
  BarChart3, 
  Wheat, 
  Package, 
  Truck, 
  Users 
} from "lucide-react";

// Map icon names to actual components
const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  Brain,
  Shield,
  Map,
  BarChart3,
  Wheat,
  Package,
  Truck,
  Users
};

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="bg-background px-4 py-20 sm:px-6 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl space-y-12">
        <ScrollReveal variant="slide-up">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Powered by Innovation
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Advanced technology working together to create sustainable impact.
            </p>
          </div>
        </ScrollReveal>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card 
                  className="group h-full border-border bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 hover:bg-card"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      {IconComponent && <IconComponent className="h-6 w-6 text-primary group-hover:text-primary transition-colors" />}
                    </div>
                    <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
        
        <ScrollReveal variant="fade" delay={0.5}>
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10 transition-all hover:bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                All data secured with a centralized audit database
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Features;
