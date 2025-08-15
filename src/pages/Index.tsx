import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap, BarChart3, Brain, Cog, Globe } from "lucide-react";

const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

// Professional palette using design system colors
const palette = {
  bg: "hsl(var(--background))",
  blue: "hsl(var(--accent-blue))",
  purple: "hsl(var(--accent-purple))",
  emerald: "hsl(var(--accent-emerald))",
  orange: "hsl(var(--accent-orange))",
};

// AutomateZAI Brand Logo
function BrandLogo({ className = "h-8 w-8" }) {
  return (
    <div className={`${className} bg-gradient-professional-primary rounded-lg flex items-center justify-center`}>
      <Cog className="h-5 w-5 text-white" />
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
    ? "text-white bg-gradient-professional-primary shadow-professional-md hover:shadow-professional-lg"
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
          <span className="text-foreground text-xl font-bold tracking-tight">AutomateZAI</span>
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
  return (
    <section id="home" className="relative isolate pt-20 text-foreground overflow-hidden bg-background">
      {/* Professional grid pattern */}
      <div aria-hidden className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "20px 20px"
        }} />
      </div>

      {/* Professional gradient orb */}
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-20 h-96 w-96 blur-3xl opacity-30">
        <div className="h-full w-full rounded-full bg-gradient-professional-primary" />
      </div>

      <Container className="relative z-10 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm text-foreground/70 mb-8">
            <CheckCircle className="h-4 w-4 text-professional-emerald" />
            Trusted by 500+ Enterprise Clients
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Premium AI Automation
            <span className="block bg-gradient-professional-primary bg-clip-text text-transparent">
              for Established Businesses
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
            Optimize operations, reduce costs, and drive exponential growth through intelligent automation solutions designed for enterprise-scale transformation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto">
              Schedule Free Consultation
            </Button>
            <Button variant="secondary" href="#services" className="w-full sm:w-auto">
              View Our Solutions
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-professional-blue">$50M+</div>
              <div className="text-sm text-foreground/60">Cost Savings</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-professional-emerald">98%</div>
              <div className="text-sm text-foreground/60">Client Satisfaction</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-professional-purple">75%</div>
              <div className="text-sm text-foreground/60">Process Efficiency</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-professional-orange">24/7</div>
              <div className="text-sm text-foreground/60">AI Operations</div>
            </div>
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
    icon: Brain,
    title: "Intelligent Process Automation",
    desc: "Transform complex workflows with AI-powered automation that learns and adapts to your business needs.",
    features: ["Workflow Optimization", "Intelligent Decision Making", "Seamless Integration"],
    color: "professional-blue"
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics & BI",
    desc: "Harness the power of data with advanced analytics and business intelligence solutions.",
    features: ["Real-time Insights", "Predictive Modeling", "Custom Dashboards"],
    color: "professional-purple"
  },
  {
    icon: Cog,
    title: "Enterprise AI Solutions",
    desc: "Comprehensive AI implementation designed for large-scale enterprise operations.",
    features: ["Scalable Architecture", "Security Compliance", "24/7 Support"],
    color: "professional-emerald"
  },
];

function Services() {
  return (
    <section id="services" className="py-20 bg-background">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Comprehensive AI Automation Services
          </h2>
          <p className="text-lg text-foreground/70">
            End-to-end automation solutions that integrate seamlessly with your existing infrastructure and deliver measurable ROI from day one.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ProfessionalCard key={service.title} className="group">
              <div className="h-full rounded-2xl border border-border bg-card p-8 hover:shadow-professional-md transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl bg-${service.color}/10 mb-6`}>
                  <service.icon className={`h-6 w-6 text-${service.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-foreground/70 mb-6">{service.desc}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                      <CheckCircle className="h-4 w-4 text-professional-emerald flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant="secondary" className="w-full">
                  Learn More
                </Button>
              </div>
            </ProfessionalCard>
          ))}
        </div>
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
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-professional-sm transition-all duration-300">
                <solution.icon className="h-8 w-8 text-professional-blue mb-4" />
                <h3 className="font-semibold mb-2">{solution.name}</h3>
                <p className="text-sm text-foreground/70">{solution.desc}</p>
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
    <section id="about" className="py-20 bg-muted/10">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Proven Methodology</h2>
          <p className="text-lg text-foreground/70">
            A systematic approach that ensures successful AI automation implementation with minimal risk and maximum impact.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => (
            <ProfessionalCard key={step.name}>
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-professional-sm transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-professional-primary flex items-center justify-center text-white font-bold text-sm">
                    {step.step}
                  </div>
                  <h3 className="font-semibold">{step.name}</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{step.desc}</p>
              </div>
            </ProfessionalCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

const pricingPlans = [
  {
    name: "Professional",
    price: "$15,000",
    period: "/month",
    desc: "Perfect for growing businesses ready to automate key processes.",
    features: [
      "Up to 5 automated workflows",
      "Basic analytics dashboard", 
      "Email support",
      "Standard integrations",
      "Monthly strategy sessions"
    ],
    cta: "Start Professional Plan",
  },
  {
    name: "Enterprise",
    price: "$45,000",
    period: "/month", 
    desc: "Comprehensive automation for large-scale operations.",
    features: [
      "Unlimited automated workflows",
      "Advanced AI analytics",
      "Dedicated success manager",
      "Custom integrations",
      "24/7 priority support",
      "Compliance & security"
    ],
    cta: "Contact Sales",
    popular: true,
  },
  {
    name: "Enterprise Plus",
    price: "Custom",
    period: "",
    desc: "Tailored solutions for complex enterprise requirements.",
    features: [
      "Custom AI model development",
      "Multi-location deployment",
      "Advanced security features",
      "Dedicated development team",
      "SLA guarantees",
      "Training & certification"
    ],
    cta: "Schedule Consultation",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-background">
      <Container>
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Investment Plans</h2>
          <p className="text-lg text-foreground/70">
            Transparent pricing designed to deliver exceptional ROI. All plans include implementation, training, and ongoing optimization.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 ${
                plan.popular 
                  ? "border-professional-blue/50 bg-professional-blue/5 ring-1 ring-professional-blue/20" 
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="inline-block px-3 py-1 rounded-full bg-professional-blue text-white text-xs font-medium mb-4">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-foreground/70 text-sm mb-6">{plan.desc}</p>
              
              <div className="flex items-end gap-1 mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-foreground/60">{plan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-professional-emerald mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.popular ? "primary" : "secondary"} 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
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
    text: "AutomateZAI transformed our entire production pipeline. The ROI was evident within the first quarter of implementation." 
  },
  { 
    name: "Michael Rodriguez", 
    role: "VP Operations, Financial Services", 
    text: "The level of expertise and support provided by AutomateZAI is unmatched. They truly understand enterprise automation needs." 
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
              Schedule a free consultation to discuss your automation needs and discover how AutomateZAI can drive measurable growth for your organization.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-professional-blue/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-professional-blue" />
                </div>
                <div>
                  <div className="font-semibold">Free 60-minute consultation</div>
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
          
          <form className="rounded-2xl border border-border bg-card p-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input 
                  className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                  placeholder="John" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input 
                  className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                  placeholder="Smith" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Business Email</label>
              <input 
                type="email" 
                className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                placeholder="john.smith@company.com" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input 
                className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" 
                placeholder="Company Name" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company Size</label>
              <select className="w-full rounded-lg bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring border border-border">
                <option>50-200 employees</option>
                <option>200-1,000 employees</option>
                <option>1,000-5,000 employees</option>
                <option>5,000+ employees</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Automation Goals</label>
              <textarea 
                rows={4} 
                className="w-full rounded-lg bg-input px-4 py-3 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border resize-none" 
                placeholder="Tell us about your automation objectives and current challenges..."
              />
            </div>
            
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="mt-1 rounded border-border bg-input" 
                required 
              />
              <label className="text-xs text-foreground/70">
                I agree to receive communications from AutomateZAI about our services and solutions. I understand I can unsubscribe at any time.
              </label>
            </div>
            
            <Button className="w-full">
              Schedule Free Consultation
            </Button>
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
              <span className="text-foreground text-xl font-bold">AutomateZAI</span>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Premium AI automation solutions for established businesses. Transform your operations, reduce costs, and drive exponential growth.
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
              <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#case-studies" className="hover:text-foreground transition-colors">Case Studies</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li>Careers</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>hello@automatezai.com</li>
              <li>+1 (555) 123-4567</li>
              <li>@automatezai</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-foreground/60">
            © {new Date().getFullYear()} AutomateZAI. All rights reserved.
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

export default function Index() {
  return (
    <div className="min-h-screen font-sans bg-background">
      <NavBar />
      <main>
        <Hero />
        <LogoCloud />
        <Services />
        <Solutions />
        <CaseStudies />
        <Process />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}