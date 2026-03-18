import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Mail, Building, MessageSquare, CheckCircle } from "lucide-react";
import AnimatedButton from "@/components/ui/animated-button";
import { logError, logUserAction } from "@/lib/logger";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const safeLogUserAction = (action: string, metadata: Record<string, unknown>) => {
    try {
      logUserAction(action, metadata, "ContactForm");
    } catch {
      // Logging should never break form flow.
    }
  };

  const safeLogError = (action: string, metadata: Record<string, unknown>) => {
    try {
      logError(action, metadata, "ContactForm");
    } catch {
      // Logging should never break form flow.
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (!isEmailValid) {
      safeLogError("VALIDATION_ERROR", {
        form: "contact",
        field: "email",
        message: "Invalid email format",
      });
      return;
    }

    try {
      safeLogUserAction("FORM_SUBMIT", { form: "contact" });

      toast({
        title: "Message sent",
        description: "Thank you for your interest. We'll get back to you soon.",
      });
      setIsSubmitted(true);
      setFormData({ name: "", email: "", organization: "", message: "" });

      safeLogUserAction("FORM_SUCCESS", { form: "contact" });

      // Reset submission status after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      safeLogError("FORM_ERROR", { form: "contact", error: errorMessage });
      throw error;
    }
  };

  return (
    <section id="contact" className="bg-card px-4 py-20 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Join the Movement
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          <p className="text-base leading-relaxed text-muted-foreground">
            Whether you're a farmer, restaurant, NGO, or just want to help, let's connect.
          </p>
        </div>
        
        {isSubmitted ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-[var(--border-color)] dark:bg-[var(--card-bg)]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-[var(--bg-secondary)]">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-2 dark:text-[var(--text-primary)]">
              Thank You!
            </h3>
            <p className="text-green-700 dark:text-[var(--text-secondary)]">
              We've received your message and will contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm dark:border-[var(--border-color)] dark:bg-[var(--card-bg)]">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-card pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-card pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Organization (Optional)"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="bg-card pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  placeholder="Tell us how you'd like to get involved..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="min-h-32 bg-card pl-10"
                />
              </div>
            </div>
            
            <AnimatedButton type="submit" className="w-full" size="lg" variant="hero" animationType="pulse">
              Send Message <Send className="ml-2 h-4 w-4" />
            </AnimatedButton>
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;