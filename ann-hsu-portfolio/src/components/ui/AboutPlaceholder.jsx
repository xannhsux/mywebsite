import { motion } from 'framer-motion';

export default function AboutPlaceholder({ onBack }) {
    return (
        <motion.div
            initial={{ y: '100%', borderRadius: '24px 24px 0 0' }}
            animate={{ y: 0, borderRadius: '0px 0px 0 0' }}
            exit={{ y: '100%', borderRadius: '24px 24px 0 0' }}
            transition={{
                type: 'spring',
                damping: 28,
                stiffness: 160,
                mass: 0.8,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center w-full h-full bg-[#001A3A] text-white pointer-events-auto shadow-[0_-10px_60px_rgba(0,0,0,0.3)] overflow-hidden"
            style={{ originY: 1 }}
        >
            {/* Top pull handle — visual cue that this is a "card" */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>

            <div className="max-w-2xl px-12 text-center space-y-12">
                <h2 className="text-4xl tracking-[1em] font-light uppercase opacity-50">
                    About Me
                </h2>

                <p className="font-serif italic text-3xl leading-relaxed opacity-90 text-blue-50">
                    &quot;A systems thinker obsessed with high-fidelity interactions and the cross-section of design and engineering.&quot;
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
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-4 text-xs tracking-[0.5em] pt-12 text-gray-400 hover:text-white transition-colors mx-auto"
                >
                    &larr; BACK TO JOURNEY
                </motion.button>
            </div>
        </motion.div>
    );
}
