import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- DATA ---
const projectData = [
    {
        title: 'Virtual Networking Feature',
        description: 'An integrated feature to facilitate one-on-one and group networking within virtual events.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        title: 'Event Registration & Payment',
        description: 'A seamless platform for event registration, ticketing, and secure payment processing.',
        imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        title: 'Energy Management Apps',
        description: 'Mobile applications for monitoring and optimizing energy consumption in commercial buildings.',
        imageUrl: 'https://images.unsplash.com/photo-1621935348325-135b91b5c49b?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
];

const testimonialData = [
    {
        text: "John's product vision and leadership were instrumental in our last launch's success. He has a unique ability to translate complex user needs into actionable product roadmaps.",
        author: 'Jane Smith',
        title: 'CEO, TechSolutions'
    },
    {
        text: "Working with John is a pleasure. His data-driven approach to product management consistently delivers outstanding results and keeps the team focused on what truly matters.",
        author: 'Mike Johnson',
        title: 'Lead Engineer, Innovate Inc.'
    },
    {
        text: "He's a master at stakeholder communication and has an incredible talent for aligning cross-functional teams towards a common goal. A true asset to any product organization.",
        author: 'Sarah Chen',
        title: 'Marketing Director, SaaS Co.'
    }
];

// --- HOOKS ---
const useInView = (options) => {
    // FIX: Specify the element type for useRef to ensure type safety.
    const ref = useRef<HTMLElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    // FIX: Use 'as const' to infer a tuple type, preventing the ref from being typed as 'boolean | RefObject'.
    return [ref, isInView] as const;
};

// --- COMPONENTS ---

const AnimatedCounter = ({ finalValue, suffix = '', isFloat = false }) => {
    const [currentValue, setCurrentValue] = useState(0);
    // FIX: Specify the element type for useRef to match the element it's attached to (<span>).
    const ref = useRef<HTMLSpanElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isInView) return;

        let startTime = Date.now();
        const duration = 2500; // Animation duration
        const frameDuration = 1000 / 60; // 60fps
        let interval;

        const updateValue = () => {
            const now = Date.now();
            const timePassed = now - startTime;

            if (timePassed < duration) {
                // Easing out function
                const progress = 1 - Math.pow(1 - timePassed / duration, 3);
                let value = progress * finalValue;
                if (isFloat) {
                    setCurrentValue(parseFloat(value.toFixed(1)));
                } else {
                    setCurrentValue(Math.floor(value));
                }
            } else {
                setCurrentValue(finalValue);
                clearInterval(interval);
            }
        };
        
        // Slot machine effect before counting up
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            if(spinCount > 20) {
                clearInterval(spinInterval);
                startTime = Date.now();
                interval = setInterval(updateValue, frameDuration);
                return;
            }
            const randomValue = Math.random() * finalValue * 1.2;
            setCurrentValue(isFloat ? parseFloat(randomValue.toFixed(1)) : Math.floor(randomValue));
            spinCount++;
        }, 50);


        return () => {
            clearInterval(interval);
            clearInterval(spinInterval);
        };
    }, [isInView, finalValue, isFloat]);
    
    return <span ref={ref} className="counter-value">{currentValue}{suffix}</span>;
};

const Section = ({ id, children }) => {
    const [ref, isInView] = useInView({ threshold: 0.1 });
    return (
        <section id={id} ref={ref} className={isInView ? 'visible' : ''}>
            <div className="container">
                {children}
            </div>
        </section>
    );
};

const Header = ({ theme, toggleTheme }) => (
    <header className="header">
        <div className="container">
            <a href="#hero" className="logo">JD</a>
            <nav className="nav-links">
                <a href="#about">About</a>
                <a href="#projects">Projects</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#contact">Contact</a>
            </nav>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
        </div>
    </header>
);

const Hero = () => (
    <Section id="hero">
        <div className="hero-content">
            <div className="hero-text">
                <h1>Hi, I'm John Doe</h1>
                <p>A Product Manager crafting exceptional SaaS solutions that drive growth and delight users.</p>
            </div>
            <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="John Doe" />
            </div>
        </div>
    </Section>
);

const About = () => (
    <Section id="about">
        <h2>Proven Impact Through Data</h2>
        <div className="stats-grid">
            <div className="stat-card">
                <AnimatedCounter finalValue={420} suffix="%" />
                <p>Return on Investment</p>
            </div>
            <div className="stat-card">
                <AnimatedCounter finalValue={6.5} suffix="x" isFloat={true} />
                <p>Return on Ad Spend</p>
            </div>
            <div className="stat-card">
                <AnimatedCounter finalValue={8.7} suffix="%" isFloat={true} />
                <p>Conversion Rate Uplift</p>
            </div>
            <div className="stat-card">
                <AnimatedCounter finalValue={250} suffix="K" />
                <p>Revenue Generated ($)</p>
            </div>
        </div>
    </Section>
);

const Projects = () => (
    <Section id="projects">
        <h2>Key Projects</h2>
        <div className="projects-marquee">
            <div className="projects-track">
                {[...projectData, ...projectData].map((project, index) => (
                    <div className="project-card" key={index}>
                        <div className="project-image-wrapper">
                            <img src={project.imageUrl} alt={project.title} />
                        </div>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </Section>
);

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialData.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialData.length) % testimonialData.length);
    };

    const currentTestimonial = testimonialData[currentIndex];

    return (
        <Section id="testimonials">
            <h2>What Others Say</h2>
            <div className="testimonial-carousel">
                <div className="testimonial-card">
                    <p className="testimonial-text">"{currentTestimonial.text}"</p>
                    <p className="testimonial-author">{currentTestimonial.author}<span>{currentTestimonial.title}</span></p>
                </div>
                <div className="carousel-nav">
                    <button onClick={prevTestimonial} className="carousel-btn prev" aria-label="Previous testimonial"><i className="fa-solid fa-chevron-left"></i></button>
                    <button onClick={nextTestimonial} className="carousel-btn next" aria-label="Next testimonial"><i className="fa-solid fa-chevron-right"></i></button>
                </div>
            </div>
        </section>
    );
};

const Contact = () => (
    <Section id="contact">
        <h2>Get In Touch</h2>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
        </form>
    </Section>
);

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="social-links">
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
            </div>
            <p>&copy; {new Date().getFullYear()} John Doe. All rights reserved.</p>
        </div>
    </footer>
);

const App = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main>
                <Hero />
                <About />
                <Projects />
                <Testimonials />
                <Contact />
            </main>
            <Footer />
        </>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
