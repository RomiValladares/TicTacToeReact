import { memo } from 'react';
import { motion } from 'framer-motion';

const Bubble = ({ color, alphaVar, duration }: { color: string, alphaVar: string, duration: number }) => {
    return (
        <motion.div
            animate={{
                x: [0, 40, -30, 20, 0],
                y: [0, -50, 40, -20, 0],
                scale: [1, 1.1, 0.9, 1.05, 1],
                rotate: [0, 45, -45, 20, 0]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="absolute rounded-full blur-[100px] pointer-events-none"
            style={{
                backgroundColor: color,
                width: '60vmax',
                height: '60vmax',
                // Restore your alpha and opacity logic
                opacity: `calc(var(--glow-opacity) * var(${alphaVar}))`,
                // Spread them out initially
                top: alphaVar === '--blob-a-alpha' ? '-10%' : alphaVar === '--blob-b-alpha' ? '40%' : '10%',
                left: alphaVar === '--blob-a-alpha' ? '-10%' : alphaVar === '--blob-b-alpha' ? '50%' : '20%',
            }}
        />
    );
};

export const BackgroundAtmosphere = memo(() => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Prime number durations (19, 23, 29) ensure they never move in a repeating pattern */}
            <Bubble color="var(--primary)" alphaVar="--blob-a-alpha" duration={19} />
            <Bubble color="var(--secondary)" alphaVar="--blob-b-alpha" duration={23} />
            <Bubble color="var(--primary)" alphaVar="--blob-c-alpha" duration={29} />
        </div>
    );
});

BackgroundAtmosphere.displayName = 'BackgroundAtmosphere';