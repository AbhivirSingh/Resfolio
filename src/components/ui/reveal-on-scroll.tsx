// components/animations/RevealOnScroll.tsx
import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  className?: string;
}

export const RevealOnScroll = ({ children, width = "100%", delay = 0, className = "" }: Props) => {
  const ref = useRef(null);
  // Changed once: true -> once: false
  // margin: "-75px" ensures the element is well inside the screen before triggering
  const isInView = useInView(ref, { once: false, margin: "-75px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      // Fade IN
      mainControls.start("visible");
    } else {
      // Fade OUT (Unreveal)
      mainControls.start("hidden");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: "relative", width }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" },
          visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        }}
        initial="hidden"
        animate={mainControls}
        // Reduced duration slightly (0.8 -> 0.5) so it feels snappier when scrolling back and forth
        transition={{ duration: 0.5, delay: delay, ease: [0.25, 0.25, 0, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};