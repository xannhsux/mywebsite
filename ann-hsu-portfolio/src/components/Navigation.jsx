import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navigation.css';

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Projects', href: '#projects' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            {/* Top Navbar — visible only at top */}
            <nav className={`navbar ${isScrolled ? 'navbar--hidden' : ''}`}>
                <div className="navbar__inner">
                    <div className="navbar__logo">© Coded by Ann</div>
                    <div className="navbar__links">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="navbar__link">
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Floating Hamburger — visible when scrolled */}
            <motion.button
                className="hamburger"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: isScrolled ? 1 : 0,
                    opacity: isScrolled ? 1 : 0
                }}
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
            >
                <div className="hamburger__line" />
                <div className="hamburger__line" />
            </motion.button>

            {/* Fullscreen Menu Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="drawer__overlay" onClick={() => setIsOpen(false)} />

                        <div className="drawer__content">
                            <button className="drawer__close" onClick={() => setIsOpen(false)}>
                                ✕
                            </button>

                            <div className="drawer__header">NAVIGATION</div>

                            <div className="drawer__links">
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.href}
                                        className="drawer__link"
                                        onClick={() => setIsOpen(false)}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + i * 0.1 }}
                                    >
                                        • {link.name}
                                    </motion.a>
                                ))}
                            </div>

                            <div className="drawer__footer">
                                <a href="#">Github</a>
                                <a href="#">Linkedin</a>
                                <a href="#">Instagram</a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
