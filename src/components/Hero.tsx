import { Leaf, Sprout, Apple, ArrowRight } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";

const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById("impact-calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background opacity-60" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="flex justify-center items-center gap-4">
          <Leaf className="h-8 w-8 text-green-500" />
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
            Zinova
          </h1>
          <Sprout className="h-8 w-8 text-green-500" />
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Empowering sustainability through technology 🌱
        </p>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Connecting farmers 🧑‍🌾, restaurants 🍽️, and NGOs ❤️ to fight food waste and hunger with AI-powered solutions
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <AnimatedButton 
            size="lg" 
            onClick={scrollToCalculator}
            className="group"
            variant="hero"
            animationType="lift"
          >
            Calculate Your Impact
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedButton>
          <div className="hidden sm:block">
            <Apple className="h-6 w-6 text-red-500" />
          </div>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Join 25+ organizations already making a difference</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;