```
import { motion } from 'framer-motion';

export default function JourneyUI({ onScrollToAbout }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-start justify-start w-full h-full p-10 pointer-events-none"
    >
      <div className="flex flex-col items-start gap-1">
        <div className="text-[11px] tracking-[0.2em] font-medium text-black uppercase">
          EXPLORATION MODE
        </div>
        <div className="text-[11px] tracking-[0.2em] font-medium text-black uppercase">
          DRAG TO ROTATE
        </div>
        
        <motion.button
          onClick={onScrollToAbout}
          className="mt-2 pointer-events-auto border border-gray-400 px-6 py-2 flex flex-col items-center gap-0 group"
        >
          <span className="text-[11px] tracking-[0.2em] font-medium text-black">
            ANN HSU
          </span>
          <span className="text-[9px] tracking-[0.1em] text-black">
            SCROLL DOWN FOR ABOUT
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
```
