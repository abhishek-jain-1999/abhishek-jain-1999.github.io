import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Download, 
  Code, 
  Cpu, 
  Database, 
  Award, 
  Star, 
  GitBranch, 
  MapPin, 
  Calendar,
  Terminal,
  Layers,
  Zap,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

/**
 * UTILITIES & HOOKS
 */

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const updatePosition = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', updatePosition);
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  return scrollPosition;
};

const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect(); // Trigger once
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return [ref, isVisible];
};

/**
 * THEME MANAGEMENT
 */
const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-primary', '#050509');
      root.style.setProperty('--bg-secondary', '#0B0B10');
      root.style.setProperty('--bg-tertiary', '#16161F');
      root.style.setProperty('--text-primary', '#F9FAFB');
      root.style.setProperty('--text-secondary', '#9CA3AF');
      root.style.setProperty('--border-color', 'rgba(31, 41, 55, 0.5)');
      root.style.setProperty('--accent-primary', '#4F46E5');
      root.style.setProperty('--accent-glow', 'rgba(79, 70, 229, 0.15)');
    } else {
      root.style.setProperty('--bg-primary', '#F9FAFB');
      root.style.setProperty('--bg-secondary', '#FFFFFF');
      root.style.setProperty('--bg-tertiary', '#F3F4F6'); 
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#4B5563');
      root.style.setProperty('--border-color', 'rgba(229, 231, 235, 1)');
      root.style.setProperty('--accent-primary', '#4F46E5');
      root.style.setProperty('--accent-glow', 'rgba(79, 70, 229, 0.05)');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

/**
 * UI COMPONENTS
 */

const RevealSection = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const Chip = ({ label, icon: Icon }) => (
  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium 
    bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] 
    hover:bg-[var(--accent-glow)] transition-all duration-300 cursor-default group shadow-sm">
    {Icon && <Icon className="w-3 h-3 mr-1.5 text-[var(--accent-primary)]" />}
    {label}
  </span>
);

const SectionTitle = ({ title, icon: Icon }) => (
  <div className="flex items-center space-x-3 mb-8">
    <div className="p-2 rounded-lg bg-[var(--accent-glow)] text-[var(--accent-primary)]">
      {Icon ? <Icon size={20} /> : <Terminal size={20} />}
    </div>
    <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{title}</h2>
    <div className="h-px bg-gradient-to-r from-[var(--accent-primary)]/50 to-transparent flex-grow ml-4"></div>
  </div>
);

/**
 * SUB-COMPONENTS
 */

const TopNav = () => {
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 20;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = React.useContext(ThemeContext);

  // Custom Smooth Scroll Handler
  const handleNavClick = (e, item) => {
    e.preventDefault();
    let targetId = item.toLowerCase();

    // Special logic for Skills to handle Desktop vs Mobile IDs
    if (targetId === 'skills') {
      const desktopSkills = document.getElementById('skills-desktop');
      // If desktop element exists and is visible (display not none), use it
      if (desktopSkills && window.getComputedStyle(desktopSkills).display !== 'none') {
        targetId = 'skills-desktop';
      } else {
        targetId = 'skills-mobile';
      }
    }

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 100; // Height of TopNav + extra padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Update URL hash without jumping
      window.history.pushState(null, null, `#${item.toLowerCase()}`);
    }

    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent
      ${isScrolled ? 'bg-[var(--bg-primary)]/90 backdrop-blur-xl shadow-lg border-[var(--border-color)] py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#22C55E] flex items-center justify-center font-bold text-white shadow-lg shadow-[#4F46E5]/20">
            AJ
          </div>
          <span className={`font-semibold tracking-tight text-[var(--text-primary)] transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
            Abhishek Jain
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {['Experience', 'Skills', 'Projects'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, item)}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-medium transition-all border border-[var(--border-color)]"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            className="text-[var(--text-primary)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] p-6 md:hidden flex flex-col space-y-4 shadow-2xl">
          {['Experience', 'Skills', 'Projects'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={(e) => handleNavClick(e, item)}
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { isDark } = React.useContext(ThemeContext);

  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#4F46E5]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#22C55E]/5 blur-[100px]" />
        {isDark && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        )}
      </div>

      <div className="max-w-[1120px] mx-auto px-6 relative z-10 w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="col-span-1 md:col-span-8 md:col-start-1">
          <RevealSection>
            <div className="flex w-fit items-center px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-semibold mb-6 border border-[#4F46E5]/20">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5] mr-2 animate-pulse"></span>
              Currently at Wheelseye Technologies
            </div>
            
            <div className="relative inline-block mb-6">
              <h1 className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                Abhishek <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#22C55E]">Jain</span>
              </h1>
              
              {/* Focus Badge - Desktop */}
              <div className="hidden md:flex absolute -top-8 -right-40 items-center gap-2 p-2 rounded-full bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] shadow-sm animate-bounce-slow transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                 <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
                    <Code size={14} />
                 </div>
                 <div className="pr-3">
                    <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">Current Focus</div>
                    <div className="text-[11px] font-bold text-[var(--text-primary)]">Scalable Systems</div>
                 </div>
              </div>
            </div>

            {/* Focus Badge - Mobile */}
            <div className="md:hidden flex items-center gap-2 mb-6 p-2 w-fit rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="w-6 h-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
                  <Code size={12} />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold leading-none mb-0.5">Current Focus</div>
                  <div className="text-xs font-bold text-[var(--text-primary)] leading-none">Scalable Systems</div>
                </div>
            </div>
            
            <h2 className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 font-light">
              Software Development Engineer • Backend + Mobile
            </h2>
            
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl mb-10">
              Building resilient backend systems and silky-smooth mobile apps. I blend clean code with scalable architecture to create digital experiences that works smoothly.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/abhishek-jain-1999" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338ca] text-white font-medium transition-all shadow-lg shadow-[#4F46E5]/25 flex items-center transform hover:translate-y-[-2px]">
                <Github size={20} className="mr-2" />
                View GitHub Profile
              </a>
              <a 
                href="/My Resume.pdf" 
                download="Abhishek Jain Resume.pdf"
                className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] font-medium transition-all flex items-center shadow-sm cursor-pointer"
              >
                <Download size={20} className="mr-2" />
                Download Resume
              </a>
              <a href="mailto:abhu.jain.1999@gmail.com" className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] font-medium transition-all flex items-center shadow-sm">
                <Mail size={20} className="mr-2" />
                Connect with me
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-[var(--text-secondary)]">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-[var(--text-muted)]" />
                New Delhi, India
              </div>
              <div className="flex items-center">
                <Layers size={16} className="mr-2 text-[var(--text-muted)]" />
                4+ Years Exp.
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

const ExperienceCard = ({ company, role, period, location, items, isLast }) => (
  <div className="relative pl-8 md:pl-0">
    <div className="hidden md:block absolute left-[-41px] top-0 bottom-0 w-px bg-[var(--border-color)]"></div>
    <div className="hidden md:block absolute left-[-45px] top-6 w-2.5 h-2.5 rounded-full bg-[#4F46E5] border-4 border-[var(--bg-primary)]"></div>

    <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-[var(--border-color)]"></div>
    <div className="md:hidden absolute left-[-4px] top-6 w-2.5 h-2.5 rounded-full bg-[#4F46E5] border-4 border-[var(--bg-primary)]"></div>

    <div className={`p-6 md:p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#4F46E5]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4F46E5]/5 ${!isLast ? 'mb-8' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">{role}</h3>
          <div className="text-[#4F46E5] font-medium mb-1">{company}</div>
        </div>
        <div className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-lg border border-[var(--border-color)] w-fit">
          {period}
        </div>
      </div>
      
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start text-sm text-[var(--text-secondary)] leading-relaxed">
            <span className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0"></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const SkillsSection = () => {
  const skillGroups = [
    {
      title: "Programming Languages",
      skills: ["Java", "Python", "JavaScript", "Kotlin", "C++"]
    },
    {
      title: "Libraries and Frameworks",
      skills: ["Firebase", "Flutter", "MVVM", "MVC", "Python Libraries", "Spring Boot", "SonarQube"]
    },
    {
      title: "Tools & Platforms",
      skills: ["MySQL", "PostgreSQL", "Android Development", "Git", "REST API", "CI/CD", "Postman", "Prompt Engineering", "GitHub", "JIRA", "Pandas", "Matplotlib", "Jenkins", "GitHub Actions", "Artifactory", "MongoDB", "Microservices", "SQL", "Excel", "Google Colab", "Docker", "Kubernetes", "NoSQL", "Generative AI"]
    }
  ];

  return (
    <div className="space-y-8 h-full">
      <SectionTitle title="Tech Stack" icon={Cpu} />
      {skillGroups.map((group, idx) => (
        <RevealSection key={idx} delay={idx * 100}>
          <div className="mb-3 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider border-b border-[var(--border-color)] pb-1 inline-block">
            {group.title}
          </div>
          <div className="flex flex-wrap gap-2">
            {group.skills.map(skill => (
              <Chip key={skill} label={skill} />
            ))}
          </div>
        </RevealSection>
      ))}
      
      <div className="pt-8 border-t border-[var(--border-color)] mt-8">
        <SectionTitle title="Education" icon={Award} />
        <RevealSection>
          <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:shadow-md transition-shadow">
            <h4 className="text-[var(--text-primary)] font-semibold">Maharaja Agrasen Institute of Technology</h4>
            <p className="text-sm text-[var(--text-secondary)] mt-1">B.Tech in Computer Science</p>
            <div className="mt-3 text-xs text-[var(--text-muted)] flex items-center">
              <Calendar size={12} className="mr-2" />
              Graduated 2021
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
};

const ProjectCard = ({ title, tags, description, delay }) => (
  <RevealSection delay={delay}>
    <div className="group h-full p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#4F46E5]/40 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-[#4F46E5]/5">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
          <Layers size={24} />
        </div>
        <a href="#" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ExternalLink size={20} />
        </a>
      </div>
      
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[#4F46E5] transition-colors">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm mb-6 flex-grow leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <span key={i} className="text-xs font-medium text-[var(--text-muted)] px-2 py-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </RevealSection>
);

const AchievementItem = ({ title, description, badge }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[#22C55E]/30 transition-all hover:bg-[var(--bg-tertiary)]">
    <div className="flex-shrink-0 mt-1">
      <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
        <Award size={16} />
      </div>
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-[var(--text-primary)] font-medium">{title}</h4>
        {badge && (
          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#22C55E] text-[#050509]">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  </div>
);

const Footer = () => (
  <footer className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-primary)] transition-colors duration-300">
    <div className="max-w-[1120px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-[var(--text-secondary)] text-sm">
        © {new Date().getFullYear()} Abhishek Jain. 
      </div>
      <div className="flex items-center space-x-6">
        <a href="#" className="text-[var(--text-secondary)] hover:text-[#4F46E5] transition-colors"><Github size={20} /></a>
        <a href="#" className="text-[var(--text-secondary)] hover:text-[#0A66C2] transition-colors"><Linkedin size={20} /></a>
        <a href="mailto:hello@example.com" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"><Mail size={20} /></a>
      </div>
      <div className="text-xs text-[var(--text-secondary)] font-mono">
        Built with React & Tailwind
      </div>
    </div>
  </footer>
);

/**
 * MAIN APP COMPONENT
 */
const Portfolio = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const AppContent = () => {
  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-secondary)] font-sans selection:bg-[#4F46E5]/30 selection:text-white transition-colors duration-300">
      <TopNav />
      <Hero />
      
      <main className="max-w-[1120px] mx-auto px-6 pb-24 mt-12 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* Main Content Column */}
          <div className="md:col-span-8 space-y-24">
            
            {/* Experience Section */}
            <section id="experience" className="scroll-mt-32">
              <SectionTitle title="Experience" icon={Zap} />
              <div className="space-y-0">
                <RevealSection delay={100}>
                  <ExperienceCard 
                    role="Software Development Engineer"
                    company="Wheelseye Technology India Pvt. Ltd."
                    period="Dec 2021 — Present"
                    location="Remote/Onsite"
                    items={[
                      "Architected and maintained high-throughput backend APIs handling varying loads using Java/Spring Boot.",
                      "Spearheaded the migration of legacy monolithic services to microservices, improving system reliability by 40%.",
                      "Led the mobile team in adopting Flutter for new modules, reducing development time by 30% across Android & iOS.",
                      "Optimized database queries in PostgreSQL, resulting in a 25% reduction in average latency.",
                      "Mentored junior developers and introduced code quality standards (CI/CD pipelines, unit testing)."
                    ]}
                  />
                </RevealSection>
                <RevealSection delay={200}>
                  <ExperienceCard 
                    role="Android Engineer"
                    company="RailYatri (Stelling Tech)"
                    period="Sep 2021 — Dec 2021"
                    location="Noida, India"
                    items={[
                      "Developed key features for the consumer-facing Android application serving millions of users.",
                      "Implemented MVVM architecture to improve code modularity and testability.",
                      "Resolved critical crash issues (ANRs) improving app stability rating from 98% to 99.5%."
                    ]}
                    isLast={true}
                  />
                </RevealSection>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="scroll-mt-32">
              <SectionTitle title="Selected Projects" icon={Layers} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectCard 
                  title="Delhi Transit"
                  description="Full-stack public transit app offering real-time bus tracking and route planning. Built custom backend to aggregate GTFS data."
                  tags={["Android", "Spring Boot", "PostgreSQL", "Google Maps API"]}
                  delay={100}
                />
                <ProjectCard 
                  title="Handwritten Digit Recognition"
                  description="Machine Learning model capable of recognizing handwritten digits from varied writing styles with 98% accuracy."
                  tags={["Python", "TensorFlow", "OpenCV", "CNN"]}
                  delay={200}
                />
              </div>
            </section>

            {/* Achievements Section */}
            <section id="achievements">
               <SectionTitle title="Highlights" icon={Star} />
               <div className="space-y-4">
                 <RevealSection>
                    <AchievementItem 
                      title="AWS AI Hackathon — Winner"
                      badge="1st Place"
                      description="Built an automated AI voice bot for truck drivers in Hindi, streamlining vehicle verification processes."
                    />
                 </RevealSection>
                 <RevealSection delay={100}>
                    <AchievementItem 
                      title="Performance Optimization Award"
                      description="Recognized at Wheelseye for significantly reducing app bundle size and API response times."
                    />
                 </RevealSection>
               </div>
            </section>

          </div>

          {/* Sidebar Column (Skills) - Desktop */}
          {/* Changed ID to skills-desktop to allow specific targeting */}
          <div className="md:col-span-4 hidden md:block pt-0" id="skills-desktop">
            <div className="scroll-mt-32">
              <SkillsSection />
            </div>
          </div>

          {/* Mobile Skills */}
          {/* Changed ID to skills-mobile to allow specific targeting */}
          <div className="md:hidden space-y-12 scroll-mt-32" id="skills-mobile">
             <SkillsSection />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Portfolio;

