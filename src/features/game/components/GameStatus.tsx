import type { GameOutcome } from '../../../core/gameLogic';

type GameStatusProps = {
    winner: GameOutcome;
    isAiThinking: boolean;
    isXNext: boolean;
};

export const GameStatus = ({ winner, isAiThinking, isXNext }: GameStatusProps) => {
    if (winner === 'draw') {
        return (
            <div className="flex h-8 items-center justify-center">
                <span className="text-xs font-black uppercase tracking-widest text-(--text-muted)">
                    Settled in a Draw
                </span>
            </div>
        );
    }

    if (winner) {
        return (
            <div className="flex h-8 items-center justify-center">
                <span
                    className={`text-xs font-black uppercase tracking-widest ${winner === 'X' ? 'text-(--primary) icon-glow-primary' : 'text-(--secondary) icon-glow-secondary'}`}
                >
                    {winner} Wins the Match
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-8 items-center justify-center">
            <p
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isXNext ? 'text-(--primary)/70' : 'text-(--secondary)/70'}`}
            >
                {isAiThinking ? 'AI is calculating...' : `Current Turn: ${isXNext ? 'X' : 'O'}`}
            </p>
        </div>
    );
};
