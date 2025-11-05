import { useCallback, useEffect, useState } from 'react';
import Robot from './Robot';
import styles from './Table.module.css';

type DirectionIndex = 0 | 1 | 2 | 3;
type Directions = 'north' | 'east' | 'south' | 'west';
type RobotType = { x: number; y: number; direction: Directions };

const directions: Directions[] = ['north', 'east', 'south', 'west'];

const nextRight: Record<DirectionIndex, DirectionIndex> = {
    0: 1,
    1: 2,
    2: 1,
    3: 0,
};

const nextLeft: Record<DirectionIndex, DirectionIndex> = {
    0: 3,
    3: 2,
    2: 3,
    1: 0,
};

function Table() {
    const [robot, setRobot] = useState<RobotType | null>(null);
    const [robotId, setRobotId] = useState<number | null>(null);
    const [position, setPosition] = useState<[number, number]>([0, 4]);
    const [directionIndex, setDirectionIndex] = useState<DirectionIndex>(0);

    useEffect(() => {
        fetch('http://localhost:3000/robot/latest')
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setRobotId(data.id);
                    setRobot(data);
                    setPosition([data.x, data.y]);
                    setDirectionIndex(
                        directions.indexOf(
                            data.direction.toLowerCase() as Directions
                        ) as DirectionIndex
                    );
                }
            })
            .catch((error) =>
                console.error('Failed to load latest robot:', error)
            );
    }, []);
	
	const squares: Array<[number, number]> = [];
    for (let y = 4; y >= 0; y--) {
        for (let x = 0; x <= 4; x++) {
            squares.push([x, y]);
        }
    }

    const sync = (next: RobotType) => {
        if (!robotId) return;
        setRobot(next);
        fetch(`http://localhost:3000/robot/sync/${robotId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(next),
        }).catch(console.error);
    };

    const createNewRobot = async (
        x: number,
        y: number,
        direction: Directions
    ) => {
        try {
            const response = await fetch('http://localhost:3000/robot/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ x, y, direction }),
            });
            const newRobot = await response.json();
            setRobotId(newRobot.id);
            setRobot(newRobot);
            setPosition([x, y]);
            setDirectionIndex(directions.indexOf(direction) as DirectionIndex);
        } catch (error) {
            console.error('Failed to create robot:', error);
        }
    };

    const turnRight = () => {
        if (!robot) return;
        const newDirectionIndex = nextRight[directionIndex];
        setDirectionIndex(newDirectionIndex);
        const next = {
            x: position[0],
            y: position[1],
            direction: directions[newDirectionIndex],
        };
        sync(next);
    };

    const turnLeft = () => {
        if (!robot) return;
        const newDirectionIndex = nextLeft[directionIndex];
        setDirectionIndex(newDirectionIndex);
        const next = {
            x: position[0],
            y: position[1],
            direction: directions[newDirectionIndex],
        };
        sync(next);
    };

    const move = () => {
        if (!robot) return;
        const [x, y] = position;
        let newX = x;
        let newY = y;

        if (directionIndex === 0 && y < 4) {
            newY = y + 1;
        } else if (directionIndex === 1 && x < 4) {
            newX = x + 1;
        } else if (directionIndex === 2 && y > 0) {
            newY = y - 1;
        } else if (directionIndex === 3 && x > 0) {
            newX = x - 1;
        }
        if (newX !== x || newY !== y) {
            setPosition([newX, newY]);
            const next = {
                x: newX,
                y: newY,
                direction: directions[directionIndex],
            };
            sync(next);
        }
    };

    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (!robot) return;

            let newDirectionIndex = directionIndex;
            let shouldMove = false;

            if (e.key === 'ArrowUp') {
                if (directionIndex === 0) {
                    shouldMove = true;
                } else {
                    newDirectionIndex = 0;
                }
            } else if (e.key === 'ArrowRight') {
                if (directionIndex === 1) {
                    shouldMove = true;
                } else {
                    newDirectionIndex = 1;
                }
            } else if (e.key === 'ArrowDown') {
                if (directionIndex === 2) {
                    shouldMove = true;
                } else {
                    newDirectionIndex = 2;
                }
            } else if (e.key === 'ArrowLeft') {
                if (directionIndex === 3) {
                    shouldMove = true;
                } else {
                    newDirectionIndex = 3;
                }
            }

            if (shouldMove) {
                move();
            } else if (newDirectionIndex !== directionIndex) {
                setDirectionIndex(newDirectionIndex);
                const next = {
                    x: position[0],
                    y: position[1],
                    direction: directions[newDirectionIndex],
                };
                sync(next);
            }
        },
        [robot, position, directionIndex]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const report = async () => {
        if (!robot) {
            alert('No Robot yet.');
            return;
        }

        alert(
            `Current Robot (ID: ${robotId})\n` +
            `Position: (${position[0]}, ${position[1]})\n` +
            `Facing: ${directions[directionIndex]}`
        );
    };

    const history = async () => {
        if (!robot) {
            alert('No Robot yet.');
            return;
        }

        try {
            const response = await fetch(
                'http://localhost:3000/robot/latest/history'
            );
            const history = await response.json();

			const historyText = history
				.slice(-50)
                .map(
                    (pos: any, i: number) =>
                        `${i + 1}. Position: (${pos.x}, ${pos.y}), Direction: ${pos.direction}`
                )
                .join('\n');

            alert(
                `History of the last moves of the current Robot (up to 50):\n\n${historyText}`
            );
        } catch (error) {
            console.error('Failed to fetch history:', error);
            alert(
                `Robot is at (${position[0]}, ${position[1]}) and is facing ${directions[directionIndex]}.`
            );
        }
    };

    return (
        <>
            <div className={styles.table}>
                {squares.map((value, i) => (
                    <div
                        key={i}
                        className={styles.square}
                        onClick={() => {
                            createNewRobot(value[0], value[1], 'north');
                        }}
                    />
                ))}
                {robot && (
                    <Robot
                        positionX={position[0]}
                        positionY={position[1]}
                        directionIndex={directionIndex}
                    />
                )}
            </div>
            <div className={styles.controls}>
                <div className={styles['movement-controls']}>
                    <button className='left' onClick={turnLeft}>
                        Left
                    </button>
                    <button className='move' onClick={move}>
                        Move
                    </button>
                    <button className='right' onClick={turnRight}>
                        Right
                    </button>
                </div>
                <button className={styles['report-button']} onClick={report}>
                    Report
                </button>
                <button className={styles['history-button']} onClick={history}>
                    History
                </button>
            </div>
        </>
    );
}

export default Table;