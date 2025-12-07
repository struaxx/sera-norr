import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We will respond within 24-48 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Contact
            </p>
            <h1 className="font-serif text-display-lg text-foreground mb-8">
              Let's Begin
            </h1>
            <p className="text-muted-foreground text-body-lg leading-relaxed">
              Whether you're interested in our collections, considering a bespoke 
              commission, or simply wish to visit our showroom—we welcome your inquiry.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="section-padding bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-12">
                The Atelier
              </h2>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-border">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-wider text-foreground mb-2">
                      Showroom
                    </h3>
                    <p className="text-muted-foreground text-body-md leading-relaxed">
                      Keizersgracht 585<br />
                      1017 DR Amsterdam<br />
                      The Netherlands
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-border">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-wider text-foreground mb-2">
                      Email
                    </h3>
                    <a 
                      href="mailto:atelier@seranorr.com" 
                      className="text-muted-foreground hover:text-foreground transition-colors text-body-md link-underline"
                    >
                      atelier@seranorr.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-border">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-wider text-foreground mb-2">
                      Visiting Hours
                    </h3>
                    <p className="text-muted-foreground text-body-md leading-relaxed">
                      By appointment only<br />
                      Monday – Friday, 10:00 – 18:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-border">
                <p className="text-muted-foreground text-body-sm leading-relaxed">
                  Our showroom visits are private and by appointment. Experience 
                  our collections in an intimate setting, guided by our team who 
                  can speak to materials, process, and customization possibilities.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-display-sm text-foreground mb-12">
                Get in Touch
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-background border-border focus:border-foreground"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background border-border focus:border-foreground"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-background border-border focus:border-foreground"
                    placeholder="Collections, Bespoke, Showroom Visit..."
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="bg-background border-border focus:border-foreground resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="atelier-filled" size="lg" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-display-sm text-foreground mb-6 italic">
              "The best objects are those that speak quietly but cannot be ignored."
            </p>
            <cite className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground not-italic">
              — Sera Norr Atelier
            </cite>
          </blockquote>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
