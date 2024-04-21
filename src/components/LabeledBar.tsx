import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";
import "./LabeledBar.css";
import uuid from "react-uuid";

interface LabeledBarProps {
  label: string;
  prev: number;
  value: number;
  max: number;
}

function LabeledBar({ label, prev, value, max }: LabeledBarProps) {
  const progress = useSpring(prev, { stiffness: 15, damping: 10 });

  useEffect(() => {
    progress.set(value / max);
  }, [value, max, progress]);

  return (
    <div key={uuid()}>
      <div className="flex justify-between">
        <span className="text">{label}</span>
        <span className="text">{value.toFixed(3)}</span>
      </div>
      <div className="w-full">
        <div>
          <motion.div
            className="bg-base-100 h-4 rounded"
            style={{ scaleX: progress, originX: 0 }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
}

export default LabeledBar;
