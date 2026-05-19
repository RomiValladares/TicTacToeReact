import type { GameOutcome } from '../../../core/gameLogic';

type GameStatusProps = {
    winner: GameOutcome;
    isAiThinking: boolean;
    isXNext: boolean;
};

const statusShellClass =
    'flex h-8 min-h-8 w-full items-center justify-center';
const statusTextClass =
    'text-center text-xs font-black uppercase tracking-widest whitespace-nowrap';

export const GameStatus = ({ winner, isAiThinking, isXNext }: GameStatusProps) => {
    if (winner === 'draw') {
        return (
            <div className={statusShellClass}>
                <span className={`${statusTextClass} text-(--text-muted)`}>
                    Settled in a Draw
                </span>
            </div>
        );
    }

    if (winner) {
        return (
            <div className={statusShellClass}>
                <span
                    className={`${statusTextClass} ${winner === 'X' ? 'text-(--primary) icon-glow-primary' : 'text-(--secondary) icon-glow-secondary'}`}
                >
                    {winner} Wins the Match
                </span>
            </div>
        );
    }

    const statusText = isAiThinking ? 'AI is calculating...' : `Current Turn: ${isXNext ? 'X' : 'O'}`;

    return (
        <div className={statusShellClass}>
            <p
                className={`${statusTextClass} transition-colors duration-300 ${isXNext ? 'text-(--primary)/70' : 'text-(--secondary)/70'}`}
            >
                {statusText}
            </p>
        </div>
    );
};
