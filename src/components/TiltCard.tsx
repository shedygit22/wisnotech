import { motion } from "framer-motion";
import { useTilt } from "../hooks/useTilt";

export default function TiltCard({
  children,
  className = "",
  intensity = 10,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const { ref, rotateX, rotateY, onMove, onLeave } = useTilt(intensity);
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(18px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
