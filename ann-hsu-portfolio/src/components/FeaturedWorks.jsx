import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './FeaturedWorks.css';

const PROJECTS = [
    {
        title: 'Fashion AI Discovery Platform',
        date: 'Jan 2024 - Present',
        image: '/projects/fashion-ai.png',
        link: '#',
    },
    {
        title: 'AI Knowledge Retrieval Engine',
        date: 'Oct 2023 - Dec 2023',
        image: '/projects/ai-retrieval.png',
        link: '#',
    },
    {
        title: 'Geodata Visualization Platform',
        date: 'Jul 2023 - Sep 2023',
        image: '/projects/geodata.png',
        link: '#',
    },
    {
        title: 'Stock Portfolio Analytics System',
        date: 'Apr 2023 - Jun 2023',
        image: '/projects/stock.png',
        link: '#',
    },
    {
        title: 'Travel Analytics LLM Integration',
        date: 'Jan 2023 - Mar 2023',
        image: '/projects/travel.png',
        link: '#',
    },
    {
        title: 'NFC Authenticity Tag iOS App',
        date: 'Sep 2022 - Dec 2022',
        image: '/projects/nfc-tag.png',
        link: '#',
    },
];

export default function FeaturedWorks() {
    const [hoveredProject, setHoveredProject] = useState(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        mouseX.set(clientX);
        mouseY.set(clientY);
    };

    return (
        <section className="works" onMouseMove={handleMouseMove}>
            <div className="works__inner">
                <div className="works__header">
                    <h2 className="works__title">Featured Works</h2>
                </div>

                <div className="works__list">
                    {PROJECTS.map((project, index) => (
                        <motion.a
                            key={index}
                            href={project.link}
                            className="works__item"
                            onMouseEnter={() => setHoveredProject(project)}
                            onMouseLeave={() => setHoveredProject(null)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                        >
                            <div className="works__item-content">
                                <h3 className="works__item-title">{project.title}</h3>
                                <span className="works__item-date">{project.date}</span>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>

            {/* Floating Image Preview */}
            <motion.div
                className="works__preview"
                style={{
                    left: smoothX,
                    top: smoothY,
                    opacity: hoveredProject ? 1 : 0,
                    scale: hoveredProject ? 1 : 0.8,
                    pointerEvents: 'none',
                }}
            >
                <div className="works__preview-inner">
                    {PROJECTS.map((project, index) => (
                        <img
                            key={index}
                            src={project.image}
                            alt=""
                            className={`works__preview-img ${hoveredProject === project ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
