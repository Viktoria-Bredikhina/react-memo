import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useState } from "react";

export function SelectLevelPage() {
  const [difficulty, setDifficulty] = useState(3);
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link
              onClick={() => setDifficulty(3)}
              className={difficulty === 3 ? styles.levelLinkSelected : styles.levelLink}
            >
              Легкий
            </Link>
          </li>
          <li className={styles.level}>
            <Link
              onClick={() => setDifficulty(6)}
              className={difficulty === 6 ? styles.levelLinkSelected : styles.levelLink}
            >
              Cредний
            </Link>
          </li>
          <li className={styles.level}>
            <Link
              onClick={() => setDifficulty(9)}
              className={difficulty === 9 ? styles.levelLinkSelected : styles.levelLink}
            >
              Сложный
            </Link>
          </li>
        </ul>
        <div className={styles.checkBox}>
          <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          Легкий режим (3 жизни)
        </div>
        <Link to={`/game/${difficulty}/${isChecked}`} className={styles.buttonStart}>
          Старт
        </Link>
        <Link to={`/leaderboard`} className={styles.text_leaderbord}>
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
