import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AlertTooltip({
  tooltipText,
  visible,
  children,
}: {
  tooltipText: string;
  visible: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      {visible && (
        <AnimatePresence>
          <motion.div
            className={`absolute z-10 top-full mt-2 left-1/2 transform -translate-x-1/2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-alert text-white text-sm font-semibold rounded px-3 py-2 whitespace-nowrap relative">
              {tooltipText}
              <div
                className={`absolute w-0 h-0 border-8 border-transparent bottom-full left-1/2 transform -translate-x-1/2 border-b-[#FF3C3C]`}
              ></div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
