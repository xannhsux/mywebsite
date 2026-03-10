import { motion } from 'framer-motion';

export default function AboutPlaceholder({ onBack }) {
    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-col items-center justify-center w-full h-full bg-[#001A3A] text-white pointer-events-auto"
        >
            <div className="max-w-2xl px-12 text-center space-y-12">
                <h2 className="text-4xl tracking-[1em] font-light uppercase opacity-50">
                    About Me
                </h2>

                <p className="font-serif italic text-3xl leading-relaxed opacity-90 text-blue-50">
                    "A systems thinker obsessed with high-fidelity interactions and the cross-section of design and engineering."
                </p>

                <div className="grid grid-cols-2 gap-12 text-left pt-12 border-t border-white/10">
                    <div className="space-y-2">
                        <h3 className="text-[10px] tracking-widest text-blue-300 uppercase font-bold">Background</h3>
                        <p className="text-sm leading-loose opacity-70">MS Data Science @ USC<br />BS Computer Science @ KCL</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-[10px] tracking-widest text-blue-300 uppercase font-bold">Stack</h3>
                        <p className="text-sm leading-loose opacity-70">React Three Fiber<br />GSAP / GLSL / Tailwind</p>
                    </div>
                </div>

                <motion.button
                    onClick={onBack}
                    whileHover={{ x: -10 }}
                    className="flex items-center gap-4 text-xs tracking-[0.5em] pt-12 text-gray-400 hover:text-white transition-colors"
                >
                    &larr; BACK TO JOURNEY
                </motion.button>
            </div>
        </motion.div>
    );
}
