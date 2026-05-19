import { motion } from 'framer-motion';

type ScoreCardProps = {
    label: string;
    score: number;
    colorClass: string;
    isLast?: boolean;
};

export const ScoreCard = ({ label, score, colorClass, isLast = false }: ScoreCardProps) => (
    <div
        className={`flex min-h-14 flex-col items-center justify-center ${!isLast ? 'border-r border-(--text-main)/10' : ''}`}
    >
        <span className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
            {label}
        </span>
        <motion.span
            key={score}
            initial={{ scale: 1.5, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`block h-7 text-xl leading-7 font-black ${colorClass}`}
        >
            {score}
        </motion.span>
    </div>
);
