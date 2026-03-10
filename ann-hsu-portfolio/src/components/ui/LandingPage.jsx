import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LandingPage({ onEnter }) {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.includes('@')) {
            onEnter();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(30px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center w-full h-full bg-white pointer-events-auto"
        >
            <form onSubmit={handleSubmit} className="relative w-full max-w-[320px]">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL"
                    autoFocus
                    className="w-full px-8 py-3 text-[11px] tracking-[0.3em] text-center transition-all bg-[#F2F2F7] rounded-full border-none outline-none focus:bg-[#E5E5EA] placeholder-gray-400 text-black uppercase"
                />

                {email.includes('@') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-6 left-0 w-full text-center"
                    >
                        <button
                            type="submit"
                            className="text-[9px] tracking-[0.4em] text-gray-400 hover:text-navy transition-colors"
                        >
                            PRESS ENTER TO START
                        </button>
                    </motion.div>
                )}
            </form>

            <div className="absolute bottom-12 text-[10px] tracking-[0.4em] text-gray-200">
                ANN HSU &copy; 2026
            </div>
        </motion.div>
    );
}
