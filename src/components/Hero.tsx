<<<<<<< HEAD
import { Leaf, Sprout, Apple, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import AnimatedButton from "@/components/ui/animated-button";
import { logUserAction } from "@/lib/logger";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    try {
      logUserAction("CTA_CLICK", { label: "Login CTA" }, "Hero");
    } catch {
      // Logging should never block CTA behavior.
    }

    navigate("/signup");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const floatVariants: Variants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:py-24">
      {/* Background with animated gradient */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" 
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl space-y-8 text-center"
      >
        
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
          <motion.div variants={floatVariants} initial="initial" animate="animate">
            <Leaf className="h-8 w-8 text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-7xl">
            Zinova
          </h1>
          <motion.div 
            variants={floatVariants} 
            initial="initial" 
            animate="animate" 
            transition={{ delay: 0.5 }}
          >
            <Sprout className="h-8 w-8 text-green-500" />
          </motion.div>
        </motion.div>
        
        <motion.p variants={itemVariants} className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl md:text-2xl font-medium">
          Empowering sustainability through technology.
        </motion.p>
        
        <motion.p variants={itemVariants} className="mx-auto max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-lg">
          Connecting farmers, restaurants, and NGOs to fight food waste and hunger with AI-powered solutions.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 pt-4 sm:flex-row">
          <AnimatedButton 
            size="lg" 
            onClick={handleCTA}
            className="group w-full sm:w-auto px-8"
            variant="hero"
            animationType="lift"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </AnimatedButton>

          <motion.div 
            variants={floatVariants} 
            initial="initial" 
            animate="animate"
            transition={{ delay: 1 }}
            className="hidden sm:block"
          >
            <Apple className="h-6 w-6 text-red-500" />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-8 text-sm text-muted-foreground font-light">
          <p>Join 25+ organizations already making a difference</p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" 
      />
    </section>
  );
};

export default Hero;
=======
import { motion } from "framer-motion";
import { Leaf, Sprout, Apple, ArrowRight, Globe, ShieldCheck } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";
import { logUserAction } from "@/lib/logger";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    try {
      logUserAction("CTA_CLICK", { label: "Login CTA" }, "Hero");
    } catch {
      // Logging should never block CTA behavior.
    }
    navigate("/signup/ngo");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:py-24">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-secondary/30 to-background" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" 
        />
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-5xl space-y-10 text-center"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
          <motion.div variants={floatingVariants} animate="animate">
            <Leaf className="h-10 w-10 text-primary" />
          </motion.div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-foreground sm:text-7xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            Zinova
          </h1>
          <motion.div variants={floatingVariants} animate="animate" style={{ animationDelay: "1s" }}>
            <Sprout className="h-10 w-10 text-primary" />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-4">
          <p className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-muted-foreground sm:text-2xl md:text-3xl">
            Empowering <span className="text-primary italic">Sustainability</span> Through Technology.
          </p>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground/80 md:text-lg">
            Connecting farmers, restaurants, and NGOs to fight food waste and hunger with a next-generation ecosystem.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center gap-6 pt-6 sm:flex-row">
          <AnimatedButton 
            size="lg" 
            onClick={handleCTA}
            className="group w-full sm:w-64 h-14 text-lg font-bold shadow-xl shadow-primary/20"
            variant="hero"
            animationType="lift"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </AnimatedButton>

          <div className="flex items-center gap-8 text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">Global Network</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Verified Impact</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Joined by <span className="text-foreground font-bold">500+</span> verified partners
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-[20%] left-[15%] opacity-20"
        >
          <Apple className="h-12 w-12 text-destructive" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-[25%] right-[10%] opacity-20"
        >
          <Leaf className="h-16 w-16 text-primary" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default Hero;
>>>>>>> 25e15eb (Add login feature and ui update)
