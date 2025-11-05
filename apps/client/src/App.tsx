import styles from './App.module.css';
import Table from './components/Table';

function App() {
    return (
        <>
            <div className={styles.instructions}>
                Click to place the robot, use the buttons or arrows to move
            </div>
            <Table />
        </>
    );
}

export default App;
