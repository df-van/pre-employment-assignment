import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function TopAreaWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`${className || ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col justify-center items-center mt-10 space-y-5">
        {children}
      </div>
    </motion.div>
  );
}
