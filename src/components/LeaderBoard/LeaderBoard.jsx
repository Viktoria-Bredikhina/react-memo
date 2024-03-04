import { useEffect, useState } from "react";
import { getLeadersList } from "../../api";
import style from "./LeaderBoard.module.css";

export function LeaderBoard() {
  const [rating, setRating] = useState([]);
  useEffect(() => {
    getLeadersList().then(data => {
      const sortedLeaders = data.leaders.sort((a, b) => a.time - b.time);
      setRating(sortedLeaders.map((leader, index) => ({ ...leader, position: index + 1 })));
    });
  }, []);
  return (
    <div className={style.board}>
      <div className={style.board_header}>
        <div className={style.position}>Позиция</div>
        <div className={style.name}>Пользователь</div>
        <div className={style.time}>Время</div>
      </div>
      <ul className={style.list}>
        {rating.map(element => {
          return (
            <li key={element.position} className={style.board_item}>
              <div className={style.position}>{element.position}</div>
              <div className={style.name}>{element.name}</div>
              <div className={style.time}>
                {Math.floor(element.time / 60)
                  .toString()
                  .padStart(2, "0") +
                  ":" +
                  (element.time % 60).toString().padStart(2, "0")}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
