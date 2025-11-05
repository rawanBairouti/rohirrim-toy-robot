import robot from '../assets/robot.png';
import arrow from '../assets/arrow.png';
import styles from './Robot.module.css';

type Directions = 'north' | 'east' | 'south' | 'west';
type DirectionIndex = 0 | 1 | 2 | 3;
type RobotProps = {
    positionX: number;
    positionY: number;
	directionIndex: DirectionIndex;
};

const directions: Directions[] = ['north', 'east', 'south', 'west'];

const degreeFromIndex = (index: DirectionIndex) => index * 90

function Robot({
    positionX,
    positionY,
    directionIndex,
}: RobotProps) {
	const direction = directions[directionIndex]
	const degree = degreeFromIndex(directionIndex)
	
	let marginBottom = direction === 'north' ? 52 : 45;

    return (
        <>
            <img
                src={robot}
                className={`${styles.robot}`}
                style={{
                    bottom: `${positionY}00px`,
                    left: `${positionX}00px`,
                }}
            />
            <img
                src={arrow}
                className={`${styles.arrow}`}
                style={{
                    transform: `rotate(${degree}deg)`,
                    bottom: `${positionY}00px`,
                    left: `${positionX}00px`,
                    marginBottom,
                }}
            />
        </>
    );
}

export default Robot;
