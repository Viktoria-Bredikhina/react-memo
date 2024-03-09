import { Link } from "react-router-dom";
import styles from "./LeaderBoardPage.module.css";
import { LeaderBoard } from "../../components/LeaderBoard/LeaderBoard";

export function LeaderBoardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Лидерборд</div>
        <Link to={`/`} className={styles.buttonStart}>
          Начать игру
        </Link>
      </div>
      <LeaderBoard />
    </div>
  );
}
