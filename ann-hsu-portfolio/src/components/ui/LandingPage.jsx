import { motion } from 'framer-motion';
import { useState } from 'react';

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
            transition={{ duration: 1, ease: 'circOut' }}
            className="flex flex-col items-center justify-center w-full h-full bg-white pointer-events-auto"
        >
            <form onSubmit={handleSubmit} className="relative w-full max-w-[320px]">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL ADDRESS"
                    autoFocus
                    className="w-full px-8 py-3.5 text-[10px] tracking-[0.4em] text-center transition-all bg-gray-50 border border-gray-100 rounded-full shadow-sm outline-none focus:bg-white focus:shadow-md focus:border-navy-light/10 placeholder-gray-400 text-black font-semibold"
                />

                {email.includes('@') && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-6 left-0 w-full text-center"
                    >
                        <button
                            type="submit"
                            className="text-[9px] tracking-[0.6em] text-gray-400 hover:text-navy uppercase transition-all hover:tracking-[0.8em]"
                        >
                            PRESS [ENTER] TO ENTER
                        </button>
                    </motion.div>
                )}
            </form>
        </motion.div>
    );
}
