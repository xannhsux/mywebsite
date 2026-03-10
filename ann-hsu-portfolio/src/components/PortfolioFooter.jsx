import { motion } from 'framer-motion';
import './PortfolioFooter.css';

export default function PortfolioFooter() {
    const currentYear = new Date().getFullYear();
    const localTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return (
        <footer className="footer">
            <div className="footer__wave">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 120L1440 120L1440 0C1440 0 1140 120 720 120C300 120 0 0 0 0L0 120Z"
                        fill="#111111"
                    />
                </svg>
            </div>

            <div className="footer__content">
                <div className="footer__top">
                    <div className="footer__info">
                        <span className="footer__label">VERSION</span>
                        <span className="footer__value">v1.2</span>
                    </div>
                    <div className="footer__info">
                        <span className="footer__label">LOCAL TIME</span>
                        <span className="footer__value">{localTime} PST</span>
                    </div>
                </div>

                <div className="footer__scrolling-text">
                    <motion.div
                        className="footer__marquee"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            duration: 20,
                            ease: "linear"
                        }}
                    >
                        <span>Get In Touch - Get In Touch - Get In Touch - Get In Touch - Get In Touch - Get In Touch -</span>
                    </motion.div>
                </div>

                <div className="footer__bottom">
                    <div className="footer__copyright">
                        COPYRIGHT ©{currentYear} ANN HSU
                    </div>
                    <div className="footer__headshot">
                        <img src="/ann-hsu.png" alt="Ann Hsu" />
                    </div>
                    <button
                        className="footer__back-to-top"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Back to Top ↑
                    </button>
                </div>
            </div>
        </footer>
    );
}
