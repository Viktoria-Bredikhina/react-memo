import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useState } from "react";
import { postLeaderAtList } from "../../api";
import { Link } from "react-router-dom";

export function EndGameModal({ isWon, isLeader, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const [value, setValue] = useState("");

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      sendResult();
    }
  };

  const title = isWon && !isLeader ? "Вы победили!" : isWon && isLeader ? "Вы попали на Лидерборд!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const sendResult = () => {
    if (value.trim() !== "") {
      postLeaderAtList({ name: value, time: gameDurationMinutes * 60 + gameDurationSeconds });
      setValue("");
    }
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isWon && isLeader && (
        <div className={styles.new_leader}>
          <input
            className={styles.name_input}
            type="text"
            placeholder="Пользователь"
            value={value}
            onInput={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={sendResult}>Добавить</Button>
        </div>
      )}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Играть снова</Button>
      {isWon && isLeader && (
        <Link to={`/leaderboard`} className={styles.text_leaderbord}>
          Перейти к лидерборду
        </Link>
      )}
    </div>
  );
}
