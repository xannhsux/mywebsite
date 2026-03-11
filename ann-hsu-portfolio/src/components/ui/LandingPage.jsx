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
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center w-full h-full pointer-events-auto bg-white"
        >
            <div className="flex flex-col items-center gap-12">
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
                    {/* Heading */}
                    <motion.p
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-[11px] tracking-[0.35em] uppercase font-mono text-gray-400"
                        style={{ fontFamily: '"JetBrains Mono", monospace' }}
                    >
                        Stay tuned
                    </motion.p>
                    {/* OpenPurpose Style Dynamic Pill Input */}
                    <motion.div
                        layout
                        className="bg-[#EEEEEE] border border-[#EEEEEE] rounded-full px-8 h-[52px] flex items-center transition-all duration-300"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="EMAIL"
                            autoFocus
                            className="bg-transparent border-none text-center uppercase font-mono text-[12px] tracking-[0.15em] text-[#666666] outline-none min-w-[120px]"
                            style={{ fontFamily: '"JetBrains Mono", monospace' }}
                        />
                    </motion.div>

                    {/* Action Prompt */}
                    <div className="h-6">
                        {email.includes('@') && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                type="submit"
                                className="text-[10px] tracking-[0.4em] text-gray-400 hover:text-black uppercase transition-all font-mono"
                            >
                                PRESS [ENTER] TO START
                            </motion.button>
                        )}
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
