import { useEffect, useRef, useState } from "react";

const nav = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Industries", href: "#industries" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

// Neon palette using design system colors
const palette = {
  bg: "hsl(var(--background))",
  cyan: "hsl(var(--neon-cyan))",
  indigo: "hsl(var(--neon-indigo))",
  fuchsia: "hsl(var(--neon-fuchsia))",
  emerald: "hsl(var(--neon-emerald))",
};

// Inline SVG brand logo (vectorized from your mark)
function BrandLogo({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden="true" focusable="false" shapeRendering="geometricPrecision">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--neon-cyan))"/>
          <stop offset="100%" stopColor="hsl(var(--neon-indigo))"/>
        </linearGradient>
      </defs>
      <g fill="url(#g)">
        {/* left leaves */}
        <path d="M56 18c-18 6-31 24-31 43 0 8 2 15 6 21 18-15 21-39 25-64z"/>
        <path d="M35 92c8-3 17-10 23-19-12 2-21 8-23 19z"/>
        {/* upward arrow */}
        <path d="M61 14l12 18h-7v61h-10V32h-7l12-18z"/>
        {/* circuits */}
        <path d="M86 40v52h-8V40c0-2 2-4 4-4s4 2 4 4z"/>
        <circle cx="86" cy="34" r="6"/>
        <path d="M103 50v42h-8V50c0-2 2-4 4-4s4 2 4 4z"/>
        <circle cx="103" cy="44" r="6"/>
        {/* right leaf arc */}
        <path d="M70 106c20-4 36-23 36-44 0-6-1-11-3-16-7 26-17 44-33 60z"/>
      </g>
    </svg>
  );
}

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, href = "#contact", variant = "primary" }) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Magnetic hover toward cursor
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0,0)";
  };

  const base = "relative inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 will-change-transform focus:outline-none";
  const style = variant === "primary"
    ? "text-primary-foreground bg-gradient-neon-primary shadow-neon-md hover:shadow-neon-lg"
    : "text-foreground/90 bg-white/10 ring-1 ring-white/10 hover:bg-white/15";

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${style}`}
    >
      <span className="relative z-[1]">{children}</span>
      {/* subtle glow */}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl opacity-70 blur-xl bg-gradient-to-r from-neon-cyan/35 via-neon-indigo/35 to-neon-fuchsia/35"
        />
      )}
    </a>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur border-b border-white/10 bg-background/80">
      <Container className="flex h-16 items-center justify-between">
        <a href="#home" className="flex items-center">
          <BrandLogo className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="ml-2 sm:ml-5 text-foreground text-base font-semibold tracking-tight">Grow with AI</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
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
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="stroke-current" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </Container>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur">
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

// Liquid / gooey cursor trail
function LiquidCursor() {
  const N = 6;
  const refs = useRef<Array<{ current: HTMLSpanElement | null }>>(Array.from({ length: N }, () => ({ current: null })));
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef(Array.from({ length: N }, () => ({ x: -100, y: -100 })));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    let raf: number;
    const loop = () => {
      const t = target.current;
      pos.current = pos.current.map((p, i) => {
        const ease = Math.max(0.08, 0.25 - i * 0.03);
        const nx = p.x + (t.x - p.x) * ease;
        const ny = p.y + (t.y - p.y) * ease;
        const el = refs.current[i].current;
        if (el) el.style.transform = `translate3d(${nx - (i === 0 ? 12 : 10)}px, ${ny - (i === 0 ? 12 : 10)}px, 0)`;
        return { x: nx, y: ny };
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      {/* SVG goo filter */}
      <svg className="fixed -z-10" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* liquid dots with gooey merge */}
      <div className="pointer-events-none fixed inset-0 z-40 hidden md:block" style={{ filter: "url(#goo)" }}>
        {Array.from({ length: N }, (_, i) => (
          <span
            key={i}
            ref={(el) => { refs.current[i].current = el; }}
            className="absolute rounded-full"
            style={{
              width: i === 0 ? 26 : 20,
              height: i === 0 ? 26 : 20,
              background: `radial-gradient(circle at 30% 30%, ${palette.cyan}, ${palette.indigo})`,
              boxShadow: "0 0 40px hsl(var(--neon-indigo) / 0.35)",
              opacity: 0.92 - i * 0.12,
            }}
          />
        ))}
      </div>
    </>
  );
}

// Utility: tilt on mouse move
function TiltCard({ children, className = "" }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    const rotX = (0.5 - py) * 10; // up/down
    const rotY = (px - 0.5) * 12; // left/right
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
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
    <section id="home" className="relative isolate pt-28 text-foreground overflow-hidden bg-background">
      {/* subtle scanlines */}
      <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.25) 0 1px, transparent 1px 56px)",
      }} />

      {/* Aurora blob animations */}
      <style>{`
        @keyframes auroraRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes auroraFloat { 0% { transform: translateY(0px); } 50% { transform: translateY(-14px); } 100% { transform: translateY(0px);} }
      `}</style>
      <div aria-hidden className="pointer-events-none absolute -left-44 top-14 h-[560px] w-[560px] blur-2xl mix-blend-screen">
        <div className="absolute inset-0 rounded-full bg-gradient-aurora-1 blur-lg animate-pulse" style={{
          animation: "auroraFloat 7s ease-in-out infinite"
        }} />
        <div className="absolute inset-0 rounded-full bg-gradient-aurora-2" style={{
          animation: "auroraRotate 26s linear infinite"
        }} />
        <div className="absolute inset-0 rounded-full bg-gradient-aurora-3 blur-md" style={{
          animation: "auroraRotate 36s linear infinite reverse"
        }} />
      </div>

      <Container className="relative z-10 py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-[44px] leading-[1.04] sm:text-7xl font-extrabold tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
              <span className="block">Transform Your</span>
              <span className="block">Business with AI</span>
              <span className="block bg-gradient-to-r from-neon-fuchsia via-neon-indigo to-neon-cyan bg-clip-text text-transparent">Automation</span>
            </h1>
            <p className="mt-6 text-lg text-foreground/85 max-w-xl">
              Custom AI systems for businesses ready to cut costs, streamline ops, and scale fast.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button>Book a Free Consultation</Button>
              <Button variant="secondary" href="#services">Explore Services</Button>
            </div>
          </div>
          {/* Right side kept minimal */}
          <div />
        </div>
      </Container>
    </section>
  );
}

function LogoCloud() {
  const logos = ["Acme Co.", "Northwind", "Globex", "Stellar", "Evergreen"];
  return (
    <section className="py-10 text-foreground/70 bg-background">
      <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {logos.map((l) => (
          <div key={l} className="text-sm tracking-widest uppercase opacity-70">
            {l}
          </div>
        ))}
      </Container>
    </section>
  );
}

const services = [
  {
    title: "AI Workflow Automation",
    desc: "Map processes, integrate apps, and deploy agents that handle repetitive work end‑to‑end.",
    bullets: ["Process mapping", "RPA + LLM agents", "App integrations"],
  },
  {
    title: "AI Chatbots & Assistants",
    desc: "On‑brand chatbots for support, sales, and internal knowledge that actually understand your business.",
    bullets: ["24/7 support", "CRM + Helpdesk", "Secure retrieval"],
  },
  {
    title: "AI Data & Insights",
    desc: "Dashboards and decision support using your data — faster insights, smarter actions.",
    bullets: ["ETL + Warehousing", "Predictive models", "BI dashboards"],
  },
];

function Services() {
  return (
    <section id="services" className="text-foreground py-20 bg-background">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">Services</h2>
          <p className="mt-3 text-foreground/70">Pick a starting point or combine services into a custom roadmap.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <TiltCard key={s.title} className="group rounded-3xl border border-white/10 bg-card p-6">
              <div className="h-10 w-10 rounded-xl mb-4 bg-gradient-to-br from-neon-cyan/50 to-neon-indigo/50" />
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-foreground/75">{s.desc}</p>
              <ul className="mt-4 space-y-2 text-sm text-foreground/70 list-disc list-inside">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Button href="#contact" variant="secondary">Get a Proposal</Button>
              </div>
            </TiltCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

const industries = [
  { name: "E‑commerce", copy: "Reduce returns, personalize CX, and automate ops." },
  { name: "Healthcare", copy: "Triage tickets, assist staff, and secure knowledge access." },
  { name: "Real Estate", copy: "Qualify leads, schedule showings, and manage docs." },
  { name: "Finance", copy: "Automate intake, reviews, and reporting with audit trails." },
  { name: "Marketing", copy: "Campaign copilots, content ops, and performance insights." },
  { name: "SaaS", copy: "Self‑serve support and product analytics for faster growth." },
];

function Industries() {
  return (
    <section id="industries" className="text-foreground py-20 bg-background">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">Industries We Serve</h2>
          <p className="mt-3 text-foreground/70">Flexible solutions tailored to your stack and compliance needs.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <TiltCard key={i.name} className="rounded-3xl border border-white/10 bg-card p-6">
              <div className="h-10 w-10 rounded-xl mb-4 bg-gradient-to-br from-neon-indigo/40 to-neon-fuchsia/40" />
              <h3 className="text-lg font-semibold">{i.name}</h3>
              <p className="mt-2 text-sm text-foreground/70">{i.copy}</p>
            </TiltCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

const studies = [
  { title: "DTC brand", metric: "-42%", desc: "drop in support response time with AI agent and CRM integration." },
  { title: "Telehealth startup", metric: "+18%", desc: "increase in booked appointments via lead‑qualifying chatbot." },
  { title: "Fintech ops", metric: "2×", desc: "faster report generation with data pipeline + BI dashboards." },
];

function CaseStudies() {
  return (
    <section id="case-studies" className="text-foreground py-20 bg-background">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">Case Studies</h2>
          <p className="mt-3 text-foreground/70">Real outcomes from recent engagements.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((c) => (
            <TiltCard key={c.title} className="rounded-3xl border border-white/10 bg-card p-6">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-neon-cyan via-neon-indigo to-neon-fuchsia bg-clip-text text-transparent">{c.metric}</div>
              <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{c.desc}</p>
            </TiltCard>
          ))}
        </div>
        <div className="mt-10">
          <Button>Request Full Case Study Pack</Button>
        </div>
      </Container>
    </section>
  );
}

const steps = [
  { name: "Discover", copy: "90‑minute workshop to align goals, data, and systems." },
  { name: "Design", copy: "Roadmap + architecture with quick‑win milestones." },
  { name: "Build", copy: "Iterative sprints, weekly demos, measurable outcomes." },
  { name: "Scale", copy: "Training, monitoring, and continuous optimization." },
];

function Process() {
  return (
    <section id="about" className="text-foreground py-20 bg-background">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">How We Work</h2>
          <p className="mt-3 text-foreground/70">A proven delivery model that keeps risk low and impact high.</p>
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <TiltCard key={s.name} className="rounded-3xl border border-white/10 bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-indigo/30 flex items-center justify-center font-bold">{idx + 1}</div>
                <h3 className="font-semibold">{s.name}</h3>
              </div>
              <p className="mt-3 text-sm text-foreground/70">{s.copy}</p>
            </TiltCard>
          ))}
        </ol>
      </Container>
    </section>
  );
}

const plans = [
  {
    name: "Starter",
    price: "$1,500",
    period: "/project",
    features: ["Roadmap workshop", "1 quick‑win automation", "Email support"],
    cta: "Start Pilot",
  },
  {
    name: "Growth",
    price: "$4,900",
    period: "/month",
    features: ["2 active sprints", "Chatbot + workflow", "Weekly reviews"],
    cta: "Scale Up",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Security & compliance", "On‑prem / VPC options", "SLAs & training"],
    cta: "Talk to Sales",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="text-foreground py-20 bg-background">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">Pricing</h2>
          <p className="mt-3 text-foreground/70">Simple plans. Real outcomes. Cancel anytime on monthly engagements.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl border p-6 ${p.highlight ? "border-neon-indigo/80 bg-neon-indigo/10" : "border-white/10 bg-card"}`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-extrabold">{p.price}</span>
                <span className="text-foreground/60">{p.period}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-foreground/70 list-disc list-inside">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Button href="#contact" variant={p.highlight ? "primary" : "secondary"}>{p.cta}</Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const quotes = [
  { name: "Maya R.", role: "COO, DTC Brand", text: "They delivered measurable impact in weeks, not months. Support volume down, CSAT up." },
  { name: "Jordan P.", role: "Founder, HealthTech", text: "The lead‑qualifying assistant doubled our demo bookings in 45 days." },
];

function Testimonials() {
  return (
    <section className="text-foreground py-20 bg-background">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">What Clients Say</h2>
          <p className="mt-3 text-foreground/70">Transparent process. Reliable outcomes.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {quotes.map((q) => (
            <TiltCard key={q.name} className="rounded-3xl border border-white/10 bg-card p-6">
              <blockquote className="text-foreground/90">"{q.text}"</blockquote>
              <figcaption className="mt-4 text-sm text-foreground/70">{q.name} — {q.role}</figcaption>
            </TiltCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "How fast can we start?", a: "Discovery can begin within a week. Pilots typically launch in 2–4 weeks." },
    { q: "Which models and platforms do you use?", a: "OpenAI, Anthropic, Azure, Vertex — plus integrations (Slack, HubSpot, Zendesk)." },
    { q: "Is my data secure?", a: "Least‑privilege access, encryption in transit/rest, optional VPC deployment." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="text-foreground py-20 bg-background">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <p className="mt-3 text-foreground/70">Short answers to common questions.</p>
        </div>
        <div className="mt-8 divide-y divide-white/10 rounded-3xl border border-white/10 bg-card">
          {items.map((item, idx) => (
            <div key={item.q}>
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                onClick={() => setOpen(open === idx ? -1 : idx)}
              >
                <span className="font-medium">{item.q}</span>
                <span className="text-foreground/60">{open === idx ? "–" : "+"}</span>
              </button>
              <div className={`px-6 pb-6 text-foreground/70 text-sm transition-all ${open === idx ? "block" : "hidden"}`}>
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="text-foreground py-20 bg-background">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Let's talk outcomes</h2>
            <p className="mt-3 text-foreground/70">Tell us about your goals. We'll propose a pilot that pays for itself.</p>
            <ul className="mt-6 space-y-3 text-foreground/80">
              <li>• 30‑min strategy call</li>
              <li>• Clear ROI model</li>
              <li>• No hard commitments</li>
            </ul>
          </div>
          <form className="rounded-3xl border border-white/10 bg-card p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-foreground/70">First name</label>
                <input className="mt-1 w-full rounded-xl bg-input px-3 py-2 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" placeholder="Jane" required />
              </div>
              <div>
                <label className="text-sm text-foreground/70">Last name</label>
                <input className="mt-1 w-full rounded-xl bg-input px-3 py-2 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" placeholder="Doe" required />
              </div>
            </div>
            <div>
              <label className="text-sm text-foreground/70">Work email</label>
              <input type="email" className="mt-1 w-full rounded-xl bg-input px-3 py-2 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-sm text-foreground/70">Company</label>
              <input className="mt-1 w-full rounded-xl bg-input px-3 py-2 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border" placeholder="Company Inc." />
            </div>
            <div>
              <label className="text-sm text-foreground/70">What do you want to build?</label>
              <textarea rows={4} className="mt-1 w-full rounded-xl bg-input px-3 py-2 text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring border border-border resize-none" placeholder="Briefly describe your goals..." />
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs text-foreground/70">
                <input type="checkbox" className="rounded border-border bg-input" />
                I agree to the privacy policy
              </label>
              <Button>Send Request</Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-foreground py-10 border-t border-white/10 bg-background">
      <Container className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center">
            <BrandLogo className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="ml-2 sm:ml-5 text-foreground text-base font-semibold tracking-tight">Grow with AI</span>
          </div>
          <p className="mt-3 text-sm text-foreground/70">Custom AI solutions that compound growth.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-4">
          <div>
            <h4 className="font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#case-studies" className="hover:text-foreground transition-colors">Case Studies</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Services</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>Automation</li>
              <li>Assistants</li>
              <li>Data & BI</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>Privacy</li>
              <li>Terms</li>
              <li>DPA</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground/70">
              <li>hello@growwithai.agency</li>
              <li>@growwithai</li>
              <li>+1 (555) 010‑0101</li>
            </ul>
          </div>
        </div>
      </Container>
      <Container className="mt-8 border-t border-white/10 pt-6 text-xs text-foreground/60">
        © {new Date().getFullYear()} Grow with AI. All rights reserved.
      </Container>
    </footer>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen font-sans bg-background">
      <LiquidCursor />
      <NavBar />
      <main>
        <Hero />
        <LogoCloud />
        <Services />
        <Industries />
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