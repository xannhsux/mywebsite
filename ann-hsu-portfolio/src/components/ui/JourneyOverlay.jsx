import { motion } from 'framer-motion';

export default function JourneyOverlay({ onEnterAbout }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start justify-start w-full h-full p-12 pointer-events-none"
        >
            <div className="flex flex-col items-start gap-1">
                <div className="text-[12px] tracking-[0.2em] font-medium text-black uppercase opacity-60">
                    EXPLORATION MODE
                </div>
                <div className="text-[12px] tracking-[0.2em] font-medium text-black uppercase opacity-60">
                    DRAG TO ROTATE
                </div>

                <motion.button
                    onClick={onEnterAbout}
                    className="mt-6 pointer-events-auto border-2 border-black/10 px-8 py-3 flex flex-col items-center gap-0 group hover:border-black/30 transition-all bg-white/50 backdrop-blur-sm"
                >
                    <span className="text-[14px] tracking-[0.3em] font-bold text-black uppercase">
                        ANN HSU
                    </span>
                    <span className="text-[9px] tracking-[0.1em] text-black/40 uppercase">
                        SCROLL DOWN FOR ABOUT
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
}
