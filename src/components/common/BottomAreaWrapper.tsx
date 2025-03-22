import { ReactNode } from "react";
import { motion } from "framer-motion";

export default function BottomAreaWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      className="relative w-full pb-8 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="px-4 pb-4">{children}</div>
    </motion.div>
  );
}
