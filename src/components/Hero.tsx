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