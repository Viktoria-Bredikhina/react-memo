import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../Card/Card";

import afterlightImageUrl from "./images/afterlight.svg";
// import curcleImageUrl from "./images/curcle.svg";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";
// Подсказка "Прозрение"
const STATUS_EYE = "STATUS_EYE";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, hasCounter = false, previewSeconds = 5 }) {
  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);
  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }
  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setIsEyeUsed(false);
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  let [attempt, setAttempt] = useState(3);

  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }

      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    // "Игрок проиграл", т.к на поле есть две открытые карты без пары
    if (playerLost) {
      if (hasCounter && attempt > 1) {
        setAttempt(attempt - 1);
        setTimeout(() => {
          // Игровое поле: закрываем неверную карту обратно.
          const nextCards = cards.map(card => {
            const isOpen = openCardsWithoutPair.indexOf(card) > -1 ? false : card.open;
            return {
              ...card,
              open: isOpen,
            };
          });

          setCards(nextCards);
        }, 700);

        return;
      } else {
        finishGame(STATUS_LOST);
        return;
      }
    }

    // ... игра продолжается
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    setAttempt(3);
    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  const [isEyeUsed, setIsEyeUsed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    const intervalId = isPaused
      ? setInterval(() => {
          setIsPaused(false);
        }, 5000)
      : setInterval(() => {
          setTimer(getTimerValue(gameStartDate, gameEndDate));
        }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, isPaused]);

  const getClassByAttempt = () => {
    if (attempt === 3 || attempt === 2) {
      return styles.attemptNormal;
    } else {
      return styles.attemptLast;
    }
  };
  const handleEyeClick = () => {
    setStatus(STATUS_EYE);
    setTimeout(() => {
      setStatus(STATUS_IN_PROGRESS);
    }, 5000);
    setIsPaused(true);
    setIsEyeUsed(true);
    setGameStartDate(new Date(gameStartDate.getTime() + 5000));
  };

  // const handleCurcleClick = () => {
  //   console.log("нажал подсказку");
  // };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <div className={styles.tooltipContainer}>
            {!isEyeUsed ? (
              <img onClick={handleEyeClick} src={afterlightImageUrl} alt="eye" className={styles.tooltipElement} />
            ) : null}
            <div className={styles.tooltip}>
              <div className={styles.tooltip_text_header}>Прозрение</div>
              <div className={styles.tooltip_text_describtion}>
                На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.
              </div>
            </div>
            {/* <img onClick={handleCurcleClick} src={curcleImageUrl} alt="curcle" /> */}
          </div>
        ) : null}
        {status === STATUS_IN_PROGRESS || status === STATUS_EYE ? (
          <Button onClick={resetGame}>Начать заново</Button>
        ) : null}
      </div>

      {hasCounter === true && status === STATUS_IN_PROGRESS && (
        <div className={getClassByAttempt()}>{`Осталось ${attempt} попыток`}</div>
      )}

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            isLeader={status === STATUS_WON && pairsCount === 9}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            usedHardMode={!hasCounter}
            usedMagic={isEyeUsed}
          />
        </div>
      ) : null}
    </div>
  );
}
