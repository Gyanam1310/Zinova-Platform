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