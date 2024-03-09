import { useEffect, useState } from "react";
import { getLeadersList } from "../../api";
import style from "./LeaderBoard.module.css";
import modeHardImageUrl from "./images/modeHard.svg";
import modeLightImageUrl from "./images/modeLight.svg";
import magicOnImageUrl from "./images/magicOn.svg";
import magicOffImageUrl from "./images/magicOff.svg";

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
        <div className={style.super}>Достижения</div>
        <div className={style.time}>Время</div>
      </div>
      <ul className={style.list}>
        {rating.map(game => {
          return (
            <li key={game.position} className={style.board_item}>
              <div className={style.position}>{game.position}</div>
              <div className={style.name}>{game.name}</div>
              <div className={style.achiv}>
                {game.achievements.indexOf(1) >= 0 ? (
                  <div className={style.tooltipContainer}>
                    <img src={modeHardImageUrl} alt="" />
                    <div className={style.tooltip}>Игра пройдена в сложном режиме</div>
                  </div>
                ) : (
                  <img src={modeLightImageUrl} alt="" className={style.modeLight} />
                )}
                {game.achievements.indexOf(2) >= 0 ? (
                  <div className={style.tooltipContainer}>
                    <img src={magicOnImageUrl} alt="" />
                    <div className={style.tooltip}>Игра пройдена без супер-сил</div>
                  </div>
                ) : (
                  <img src={magicOffImageUrl} alt="" />
                )}
              </div>
              <div className={style.time}>
                {Math.floor(game.time / 60)
                  .toString()
                  .padStart(2, "0") +
                  ":" +
                  (game.time % 60).toString().padStart(2, "0")}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
