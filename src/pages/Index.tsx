import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap, BarChart3, Brain, Cog, Globe, Rocket, Sparkles, MessageCircle, Clock } from "lucide-react";
import { MouseFollower } from '@/components/MouseFollower';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Autoplay from "embla-carousel-autoplay";
import logoImage from '@/assets/grow-with-ai-logo.png';

const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

// Neon palette using design system colors
const palette = {
  bg: "hsl(var(--background))",
  cyan: "hsl(var(--neon-cyan-color))",
  purple: "hsl(var(--neon-purple-color))",
  pink: "hsl(var(--neon-pink-color))",
  blue: "hsl(var(--neon-blue-color))",
};

// Grow with AI Brand Logo
function BrandLogo({ className = "h-12 w-12" }) {
  return (
    <div className={`${className} relative`}>
      <img 
        src={logoImage} 
        alt="Grow with AI Logo" 
        className="w-full h-full object-contain drop-shadow-neon-glow"
      />
      <div className="absolute inset-0 bg-gradient-radial from-neon-cyan-color/20 to-transparent opacity-50 blur-sm -z-10"></div>
    </div>
  );
}

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, href = "#contact", variant = "primary", className = "" }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Subtle magnetic hover effect
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.03}px, ${y * 0.03}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0,0)";
  };

  const base = "relative inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 will-change-transform focus:outline-none";
  const style = variant === "primary"
    ? "text-white bg-gradient-neon-primary shadow-neon-md hover:shadow-neon-lg border-0"
    : "text-foreground bg-card border border-border hover:bg-muted/50";

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${style} ${className}`}
    >
      <span className="relative z-[1] flex items-center gap-2">
        {children}
        {variant === "primary" && <ArrowRight className="h-4 w-4" />}
      </span>
    </a>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl border-b border-border bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <BrandLogo />
          <span className="text-foreground text-xl font-bold tracking-tight bg-gradient-neon-primary bg-clip-text text-transparent">Grow with AI</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              {n.label}
            </a>
          ))}
          <Button>Get Started</Button>
        </nav>
        <button
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </Container>
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <Container className="py-4 flex flex-col gap-4">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-foreground/90 hover:text-foreground">
                {n.label}
              </a>
            ))}
            <Button>Get Started</Button>
          </Container>
        </div>
      )}
    </header>
  );
}

// Professional card component with subtle tilt
function ProfessionalCard({ children, className = "" }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rotX = (0.5 - py) * 5; // Subtle rotation
    const rotY = (px - 0.5) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-200 will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

function Hero() {
  const [typedText, setTypedText] = useState("");
  const phrases = ["Dreams", "Ideas", "Potential", "Success", "Business"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showDashboardDetails, setShowDashboardDetails] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let charIndex = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setTypedText(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
      } else if (!isDeleting) {
        setTimeout(() => { isDeleting = true; }, 2000);
      } else {
        isDeleting = false;
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(typeInterval);
  }, [phraseIndex]);

  return (
    <section id="home" className="relative isolate pt-20 text-foreground overflow-hidden bg-background">
      {/* Neon grid pattern */}
      <div aria-hidden className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(hsl(var(--neon-cyan-color)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple-color)) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Multiple animated neon orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/20 rounded-full blur-3xl animate-pulse shadow-neon-lg"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse delay-1000 shadow-neon-cyan"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-pink/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Container className="relative z-10 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-card border border-neon-cyan/30 px-4 py-2 text-sm text-neon-cyan mb-8 hover:border-neon-cyan/50 transition-colors shadow-neon-sm">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
              🚀 Supercharge Your Growth
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block">Grow Your</span>
              <span className="block bg-gradient-neon-primary bg-clip-text text-transparent min-h-[1.2em]">
                {typedText}<span className="animate-pulse text-neon-cyan">|</span>
              </span>
              <span className="block">with AI</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed">
              Unlock your potential with AI-powered growth solutions. Transform ideas into reality, scale faster than ever, and achieve extraordinary results.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
              <Button className="w-full sm:w-auto group bg-gradient-neon-primary hover:shadow-neon-lg">
                Start Growing Today
                <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" href="#features" className="w-full sm:w-auto border-neon-purple text-neon-purple hover:bg-neon-purple/20">
                Explore Features
              </Button>
            </div>
            
            {/* Enhanced trust indicators with neon styling */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-neon-cyan/30 hover:bg-card/80 transition-all duration-300 hover:shadow-neon-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-neon-cyan" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">10x</div>
                  <div className="text-sm text-foreground/60">Growth Rate</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-neon-purple/30 hover:bg-card/80 transition-all duration-300 hover:shadow-neon-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-neon-purple/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-neon-purple" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">1M+</div>
                  <div className="text-sm text-foreground/60">Dreams Realized</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/30 hover:border-neon-pink/30 hover:bg-card/80 transition-all duration-300 hover:shadow-neon-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-neon-pink/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-neon-pink" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">95%</div>
                  <div className="text-sm text-foreground/60">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive growth dashboard mockup */}
          <div className="relative">
            <div className="relative bg-card border border-neon-cyan/30 rounded-2xl p-6 shadow-neon-md hover:shadow-neon-lg transition-all duration-500 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-neon-primary rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-card-foreground">Growth Dashboard</h3>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse delay-300"></div>
                  <div className="w-3 h-3 rounded-full bg-neon-pink animate-pulse delay-700"></div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">AI Optimization</span>
                    <span className="text-sm font-semibold text-neon-cyan">+340% Efficiency</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-neon-primary h-3 rounded-full animate-pulse transition-all duration-1000 shadow-neon-sm" style={{width: '90%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Growth Acceleration</span>
                    <span className="text-sm font-semibold text-neon-purple">+250% Faster</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div className="bg-neon-purple h-3 rounded-full animate-pulse delay-500 transition-all duration-1000 shadow-neon-sm" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="text-sm font-semibold text-neon-pink">+180% Better</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div className="bg-neon-pink h-3 rounded-full animate-pulse delay-1000 transition-all duration-1000 shadow-neon-sm" style={{width: '95%'}}></div>
                  </div>
                </div>
              </div>
              
              {/* Live status indicator */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Live growth • Updated now</span>
                </div>
                <button 
                  onClick={() => setShowDashboardDetails(!showDashboardDetails)}
                  className="text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  {showDashboardDetails ? "Hide Details ←" : "View Details →"}
                </button>
              </div>
            </div>
            
            {/* Expanded dashboard details */}
            {showDashboardDetails && (
              <div className="mt-6 bg-card border border-neon-purple/30 rounded-2xl p-6 shadow-neon-md animate-in slide-in-from-top-2 duration-300">
                <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-neon-purple" />
                  Detailed Analytics
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Revenue Growth</div>
                    <div className="text-2xl font-bold text-neon-cyan">$2.4M</div>
                    <div className="text-xs text-green-500">+67% this quarter</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                    <div className="text-2xl font-bold text-neon-purple">24</div>
                    <div className="text-xs text-green-500">+8 new this month</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Automation Savings</div>
                    <div className="text-2xl font-bold text-neon-pink">847hrs</div>
                    <div className="text-xs text-green-500">per month saved</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">AI Efficiency</div>
                    <div className="text-2xl font-bold text-neon-cyan">98.7%</div>
                    <div className="text-xs text-green-500">accuracy rate</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last updated: 2 minutes ago</span>
                    <div className="flex gap-2">
                      <button className="text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                        Export Data
                      </button>
                      <button className="text-xs text-neon-purple hover:text-neon-purple/80 transition-colors">
                        Full Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
function LogoCloud() {
  const companies = ["Enterprise Corp", "Global Industries", "Tech Solutions", "Innovation Labs", "Future Systems"];
  return (
    <section className="py-16 bg-muted/20">
      <Container>
        <p className="text-center text-foreground/60 text-sm mb-8">Trusted by industry leaders worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company) => (
            <div key={company} className="text-foreground/40 font-semibold tracking-wider text-sm">
              {company}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const services = [
  {
    icon: Cog,
    title: "Autonomous AI Agents",
    desc: "The Agentic era has begun. Businesses not deploying AI agents in 2025 are already behind. These systems don't just automate—they act. One entry point, one instruction, then wait. Results show up. No micromanaging. From internal operations to customer-facing tasks, these agents work round the clock—so you don't have to.",
    features: ["One Entry Point", "No Micromanaging", "24/7 Operation"],
    color: "neon-purple"
  },
  {
    icon: Zap,
    title: "Workflow Automations",
    desc: "No inputs needed. These automations run on their own—daily, weekly, or on triggers. From analysing data and generating reports to sending invoices or onboarding clients—everything you usually do on weekends gets done before Monday. Quiet, fast, and always on.",
    features: ["Trigger-Based", "Weekend Work Done", "Always On"],
    color: "neon-purple"
  },
  {
    icon: MessageCircle,
    title: "AI Voice Agents",
    desc: "Inbound or outbound—AI voice agents talk to your leads and customers in real-time. They answer, qualify, remind, and follow up—so you don't have to. 2025's standard for modern business communication.",
    features: ["Real-time Communication", "Lead Qualification", "Modern Standard"],
    color: "neon-purple"
  },
  {
    icon: Clock,
    title: "Social Media AI Systems",
    desc: "AI handles your content, comments, and conversations. It writes, schedules, replies, and even reaches out. Whether it's building brand presence or supporting leads—your AI system works the platform while you run the business.",
    features: ["Content Creation", "Automated Engagement", "Brand Building"],
    color: "neon-purple"
  },
];

function Services() {
  return (
    <section id="services" className="py-20 bg-background relative overflow-hidden">
      {/* Neon background effects */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-neon-primary bg-clip-text text-transparent">
            Comprehensive AI Automation Services
          </h2>
          <p className="text-xl text-foreground/70 leading-relaxed">
            End-to-end automation solutions that integrate seamlessly with your existing infrastructure and deliver measurable ROI from day one.
          </p>
        </div>
        
        {/* Carousel Services Container */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {services.map((service, index) => (
              <CarouselItem key={service.title} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="group h-full">
                  <div className="h-full rounded-2xl border border-neon-purple/30 bg-card/50 backdrop-blur-sm p-8 hover:shadow-neon-lg hover:border-neon-purple/50 transition-all duration-500 hover:scale-[1.02] hover:bg-card/80 relative flex flex-col">
                    {/* Neon glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="inline-flex p-4 rounded-xl bg-neon-purple/20 mb-6 group-hover:bg-neon-purple/30 transition-colors duration-300 shadow-neon-sm w-fit">
                        <service.icon className="h-8 w-8 text-neon-purple group-hover:text-neon-cyan transition-colors duration-300" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-transparent group-hover:bg-gradient-neon-primary group-hover:bg-clip-text transition-all duration-300">
                        {service.title}
                      </h3>
                      <p className="text-foreground/70 mb-8 leading-relaxed text-lg">
                        {service.desc}
                      </p>
                      
                      <ul className="space-y-3 mb-8 flex-1">
                        {service.features.map((feature, idx) => (
                          <li key={feature} className="flex items-center gap-3 text-foreground/80">
                            <div className="w-5 h-5 rounded-full bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-3 w-3 text-neon-cyan" />
                            </div>
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full bg-gradient-neon-primary hover:shadow-neon-md border-0 text-white font-semibold mt-auto">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-card/80 backdrop-blur-sm border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-sm -left-12" />
          <CarouselNext className="bg-card/80 backdrop-blur-sm border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-sm -right-12" />
        </Carousel>
      </Container>
    </section>
  );
}

const solutions = [
  { icon: Users, name: "Financial Services", desc: "Automated compliance, risk assessment, and customer onboarding." },
  { icon: TrendingUp, name: "Manufacturing", desc: "Predictive maintenance, quality control, and supply chain optimization." },
  { icon: Shield, name: "Healthcare", desc: "Patient data management, diagnostic assistance, and workflow automation." },
  { icon: Globe, name: "Retail & E-commerce", desc: "Inventory management, customer insights, and personalization engines." },
  { icon: Zap, name: "Technology", desc: "DevOps automation, code analysis, and infrastructure management." },
  { icon: BarChart3, name: "Professional Services", desc: "Document processing, client management, and billing automation." },
];

function Solutions() {
  return (
    <section id="solutions" className="py-20 bg-muted/10">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Industry-Specific Solutions</h2>
          <p className="text-lg text-foreground/70">
            Tailored AI automation solutions designed for the unique challenges and opportunities in your industry.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <ProfessionalCard key={solution.name}>
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-professional-sm hover:border-neon-cyan/30 hover:bg-card/80 transition-all duration-300 group">
                <solution.icon className="h-8 w-8 text-professional-blue mb-4 group-hover:text-neon-cyan group-hover:scale-110 transition-all duration-300" />
                <h3 className="font-semibold mb-2 group-hover:text-neon-cyan transition-colors duration-300">{solution.name}</h3>
                <p className="text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors duration-300">{solution.desc}</p>
              </div>
            </ProfessionalCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

const caseStudies = [
  { 
    title: "Global Manufacturing Corp", 
    metric: "47%", 
    desc: "reduction in operational costs through intelligent process automation and predictive maintenance.",
    industry: "Manufacturing"
  },
  { 
    title: "Financial Services Leader", 
    metric: "6x", 
    desc: "faster compliance reporting with automated risk assessment and regulatory documentation.",
    industry: "Finance"
  },
  { 
    title: "Healthcare Network", 
    metric: "85%", 
    desc: "improvement in patient data processing speed with AI-powered workflow optimization.",
    industry: "Healthcare"
  },
];

function CaseStudies() {
  return (
    <section id="case-studies" className="py-20 bg-background">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Proven Results Across Industries</h2>
          <p className="text-lg text-foreground/70">
            Real transformation stories from enterprise clients who have achieved measurable success with our AI automation solutions.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <ProfessionalCard key={study.title}>
              <div className="rounded-2xl border border-border bg-card p-8 hover:shadow-professional-md transition-all duration-300">
                <div className="inline-block px-3 py-1 rounded-full bg-professional-blue/10 text-professional-blue text-xs font-medium mb-4">
                  {study.industry}
                </div>
                <div className="text-4xl font-bold bg-gradient-professional-primary bg-clip-text text-transparent mb-2">
                  {study.metric}
                </div>
                <h3 className="font-semibold mb-3">{study.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{study.desc}</p>
              </div>
            </ProfessionalCard>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button>View All Case Studies</Button>
        </div>
      </Container>
    </section>
  );
}

const process = [
  { 
    step: "1", 
    name: "Assessment", 
    desc: "Comprehensive analysis of your current processes and automation opportunities." 
  },
  { 
    step: "2", 
    name: "Strategy", 
    desc: "Custom roadmap design with clear milestones and measurable success metrics." 
  },
  { 
    step: "3", 
    name: "Implementation", 
    desc: "Phased deployment with minimal disruption to your existing operations." 
  },
  { 
    step: "4", 
    name: "Optimization", 
    desc: "Continuous monitoring, learning, and performance enhancement." 
  },
];

function Process() {
  return (
    <section id="process" className="py-20 bg-muted/10">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Proven Methodology</h2>
          <p className="text-lg text-foreground/70">
            A systematic approach that ensures successful AI automation implementation with minimal risk and maximum impact.
          </p>
          <p className="text-lg text-foreground/70 mt-4">
            At Grow with AI, we fuse advanced artificial intelligence with human expertise to help businesses eliminate inefficiencies, accelerate growth, and scale smarter. We've worked with organizations to reduce repetitive manual tasks, automate decision-making, and innovate faster—without the heavy costs of building everything in-house.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => (
            <ProfessionalCard key={step.name}>
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-professional-sm hover:border-neon-purple/30 hover:bg-card/80 transition-all duration-300 h-full flex flex-col group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-professional-primary flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 group-hover:shadow-neon-md transition-all duration-300">
                    {step.step}
                  </div>
                  <h3 className="font-semibold group-hover:text-neon-purple transition-colors duration-300">{step.name}</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed flex-1 group-hover:text-foreground/90 transition-colors duration-300">{step.desc}</p>
              </div>
            </ProfessionalCard>
          ))}
        </div>
      </Container>
    </section>
  );
}



const testimonials = [
  { 
    name: "Sarah Chen", 
    role: "CTO, Global Manufacturing", 
    text: "Grow with AI transformed our entire production pipeline. The ROI was evident within the first quarter of implementation." 
  },
  { 
    name: "Michael Rodriguez", 
    role: "VP Operations, Financial Services", 
    text: "The level of expertise and support provided by Grow with AI is unmatched. They truly understand enterprise automation needs." 
  },
];

function Testimonials() {
  return (
    <section className="py-20 bg-muted/10">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-foreground/70">
            Trusted by executives and technical leaders at the world's most innovative companies.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <ProfessionalCard key={testimonial.name}>
              <div className="rounded-xl border border-border bg-card p-8 hover:shadow-professional-sm transition-all duration-300">
                <blockquote className="text-foreground/90 mb-6 text-lg leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                <figcaption>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-foreground/60 text-sm">{testimonial.role}</div>
                </figcaption>
              </div>
            </ProfessionalCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FounderIntro() {
  return (
    <section id="about" className="py-20 bg-background">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Founder Image */}
          <div className="flex justify-center lg:justify-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-card shadow-neon-md hover:shadow-neon-lg transition-all duration-500 hover:scale-[1.02]">
                <img 
                  src="/lovable-uploads/d6ba6530-2f95-4ed4-aab6-7c4685cb2f69.png" 
                  alt="Sandeep, Founder of Grow with AI" 
                  className="w-80 object-contain"
                />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-neon-cyan/10 to-transparent opacity-30 blur-xl -z-10"></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Hey, it's <span className="bg-gradient-neon-primary bg-clip-text text-transparent">Sandeep</span>
            </h2>
            
            <div className="text-lg text-foreground/80 leading-relaxed space-y-4">
              <p>
                I'm the founder of <strong className="text-neon-cyan">Grow with AI</strong>—where our mission is simple: Grow your business with AI.
              </p>
              
              <p>
                With AI, tasks that once took <strong className="text-neon-purple">95 minutes → 5 minutes</strong>. That's the power of automation and intelligence combined—working <strong className="text-neon-pink">24/7/365</strong> so your business runs faster, smarter, and at scale.
              </p>
              
              <p>
                At <strong className="text-neon-cyan">Grow with AI</strong>, we don't replace people—we <strong className="text-foreground">empower them</strong>. AI supercharges your team so they can focus on what truly drives growth, while the systems handle the rest.
              </p>
              
              <p>
                If you're ready to scale smarter, let's connect and <a href="#contact" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors underline decoration-neon-cyan/50 hover:decoration-neon-cyan">schedule free consultation</a>.
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-semibold text-white bg-gradient-neon-primary shadow-neon-md hover:shadow-neon-lg transition-all duration-200 will-change-transform hover:scale-[1.02] group"
              >
                <span className="relative z-[1] flex items-center gap-3">
                  Book Your Free Consultation
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FAQ() {
  const faqItems = [
    { 
      q: "How quickly can we see results?", 
      a: "Most clients see initial productivity gains within 30-45 days of implementation, with full ROI typically achieved within 6-12 months." 
    },
    { 
      q: "What level of technical expertise is required?", 
      a: "None. We handle all technical implementation and provide comprehensive training. Your team focuses on business outcomes, not technical details." 
    },
    { 
      q: "How do you ensure data security and compliance?", 
      a: "We follow enterprise-grade security protocols including SOC 2, GDPR compliance, and offer on-premise deployment options for sensitive environments." 
    },
    { 
      q: "Can you integrate with our existing systems?", 
      a: "Yes. We specialize in seamless integration with popular enterprise platforms including Salesforce, SAP, Microsoft, and custom legacy systems." 
    },
  ];
  
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-foreground/70">
            Common questions about our AI automation solutions and implementation process.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {faqItems.map((item, index) => (
              <div key={item.q}>
                <button
                  className="w-full text-left px-6 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                >
                  <span className="font-medium pr-4">{item.q}</span>
                  <span className="text-foreground/60 text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-foreground/70 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-20 bg-muted/10">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Schedule a free consultation to discuss your automation needs and discover how Grow with AI can drive measurable growth for your organization.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-professional-blue/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-professional-blue" />
                </div>
                <div>
                  <div className="font-semibold">Free 30-minute consultation</div>
                  <div className="text-foreground/60 text-sm">Comprehensive automation assessment</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-professional-emerald/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-professional-emerald" />
                </div>
                <div>
                  <div className="font-semibold">Custom ROI projection</div>
                  <div className="text-foreground/60 text-sm">Detailed cost-benefit analysis</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-professional-purple/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-professional-purple" />
                </div>
                <div>
                  <div className="font-semibold">No obligation proposal</div>
                  <div className="text-foreground/60 text-sm">Tailored implementation roadmap</div>
                </div>
              </div>
            </div>
          </div>
          
          <form id="consult-form" className="rounded-2xl border border-border bg-card p-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input 
                  id="firstName"
                  className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                  placeholder="John" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input 
                  id="lastName"
                  className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                  placeholder="Smith" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Business Email</label>
              <input 
                id="email"
                type="email" 
                className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                placeholder="john.smith@company.com" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input 
                id="company"
                className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                placeholder="Company Name" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company Size</label>
              <select id="companySize" className="w-full rounded-lg bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring border border-border">
                <option>Just me</option>
                <option>2-5 employees</option>
                <option>6-10 employees</option>
                <option>11-20 employees</option>
                <option>20-50 employees</option>
                <option>50-100 employees</option>
                <option>100+ employees</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Automation Goals</label>
              <textarea 
                id="goals"
                rows={4} 
                className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border resize-none" 
                placeholder="Tell us about your automation objectives and current challenges..."
              />
            </div>
            
            <div className="flex items-start gap-3">
              <input 
                id="consent"
                type="checkbox" 
                className="mt-1 rounded border-border bg-input" 
                required 
              />
              <label className="text-xs text-foreground/70">
                I agree to receive communications from Grow with AI about our services and solutions. I understand I can unsubscribe at any time.
              </label>
            </div>
            
            <button type="submit" className="w-full relative inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 will-change-transform focus:outline-none text-white bg-gradient-neon-primary shadow-neon-md hover:shadow-neon-lg border-0">
              <span className="relative z-[1] flex items-center gap-2">
                Schedule Free Consultation →
              </span>
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 border-t border-border bg-background">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo />
              <span className="text-foreground text-xl font-bold bg-gradient-neon-primary bg-clip-text text-transparent">Grow with AI</span>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              AI-powered growth solutions that unlock your potential and transform ideas into extraordinary results.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><a href="#services" className="hover:text-foreground transition-colors">Process Automation</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Predictive Analytics</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Enterprise AI</a></li>
              <li><a href="#solutions" className="hover:text-foreground transition-colors">Industry Solutions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><a href="#home" className="hover:text-foreground transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-foreground transition-colors">Services</a></li>
              <li><a href="#process" className="hover:text-foreground transition-colors">Process</a></li>
              <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>hello@growwithai.com</li>
              <li>+1 (555) 123-4567</li>
              <li>@growwithai</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-foreground/60">
            © {new Date().getFullYear()} Grow with AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-foreground/60">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Data Processing Agreement</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

const featureCategories = [
  {
    id: "automation",
    label: "AI Automation",
    icon: Cog,
    features: [
      {
        name: "Autonomous AI Agents",
        description: "Self-managing AI systems that handle complex tasks from start to finish without supervision.",
        benefits: ["24/7 Operation", "Zero Micromanaging", "Intelligent Decision Making"]
      },
      {
        name: "Workflow Automations", 
        description: "Trigger-based systems that automate repetitive processes and eliminate weekend work.",
        benefits: ["Trigger-Based Execution", "Process Optimization", "Time Savings"]
      },
      {
        name: "Smart Integrations",
        description: "Seamless connection between your existing tools and AI-powered enhancements.",
        benefits: ["System Integration", "Data Flow Automation", "Legacy Compatibility"]
      }
    ]
  },
  {
    id: "communication", 
    label: "AI Communication",
    icon: MessageCircle,
    features: [
      {
        name: "AI Voice Agents",
        description: "Real-time voice communication systems for inbound and outbound customer interactions.",
        benefits: ["Real-time Processing", "Lead Qualification", "Customer Support"]
      },
      {
        name: "Social Media AI",
        description: "Complete social media management including content creation, scheduling, and engagement.",
        benefits: ["Content Generation", "Automated Engagement", "Brand Management"]
      },
      {
        name: "Multi-Channel Support",
        description: "Unified AI communication across email, chat, phone, and social platforms.",
        benefits: ["Omnichannel Experience", "Consistent Messaging", "24/7 Availability"]
      }
    ]
  },
  {
    id: "analytics",
    label: "AI Analytics", 
    icon: BarChart3,
    features: [
      {
        name: "Predictive Intelligence",
        description: "Advanced forecasting and trend analysis to drive strategic business decisions.",
        benefits: ["Future Insights", "Risk Assessment", "Strategic Planning"]
      },
      {
        name: "Performance Monitoring",
        description: "Real-time tracking and optimization of all AI systems and business processes.",
        benefits: ["Live Monitoring", "Performance Optimization", "ROI Tracking"]
      },
      {
        name: "Custom Dashboards",
        description: "Personalized analytics interfaces tailored to your specific business metrics.",
        benefits: ["Custom Metrics", "Visual Reporting", "Executive Insights"]
      }
    ]
  }
];

function Features() {
  const [activeTab, setActiveTab] = useState("automation");
  
  return (
    <section id="features" className="py-20 bg-muted/10">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">AI-Powered Feature Suite</h2>
          <p className="text-lg text-foreground/70">
            Comprehensive AI solutions designed to transform every aspect of your business operations with intelligent automation and strategic insights.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-14 bg-card border border-border/30 rounded-2xl p-2">
            {featureCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-3 px-6 py-3 text-base font-medium data-[state=active]:bg-gradient-neon-primary data-[state=active]:text-white data-[state=active]:shadow-neon-md transition-all duration-300 rounded-xl"
              >
                <category.icon className="h-5 w-5" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {featureCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.features.map((feature, index) => (
                  <ProfessionalCard key={feature.name}>
                    <div className="h-full rounded-2xl border border-neon-cyan/30 bg-card/50 backdrop-blur-sm p-8 hover:shadow-neon-lg hover:border-neon-cyan/50 transition-all duration-500 hover:scale-[1.02] hover:bg-card/80 relative flex flex-col group">
                      {/* Neon glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="inline-flex p-4 rounded-xl bg-neon-cyan/20 mb-6 group-hover:bg-neon-cyan/30 transition-colors duration-300 shadow-neon-sm w-fit">
                          <category.icon className="h-8 w-8 text-neon-cyan group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-transparent group-hover:bg-gradient-neon-primary group-hover:bg-clip-text transition-all duration-300">
                          {feature.name}
                        </h3>
                        
                        <p className="text-foreground/70 mb-8 leading-relaxed text-lg flex-1">
                          {feature.description}
                        </p>
                        
                        <ul className="space-y-3">
                          {feature.benefits.map((benefit, idx) => (
                            <li key={benefit} className="flex items-center gap-3 text-foreground/80">
                              <div className="w-5 h-5 rounded-full bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="h-3 w-3 text-neon-cyan" />
                              </div>
                              <span className="font-medium">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </ProfessionalCard>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="text-center mt-16">
          <Button className="bg-gradient-neon-primary hover:shadow-neon-lg">
            Explore All Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen font-sans bg-background">
      <MouseFollower />
      <NavBar />
      <main>
      <Hero />
      <LogoCloud />
      <Services />
      <Features />
      <Solutions />
      <Process />
      <Testimonials />
      <FounderIntro />
      <FAQ />
      <Contact />
      </main>
      <Footer />
    </div>
  );
}