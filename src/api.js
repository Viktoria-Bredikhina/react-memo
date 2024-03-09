export function getLeadersList() {
  return fetch(" https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "GET",
  }).then(response => {
    if (!response.ok) {
      throw new Error("ошибка сервера");
    }
    return response.json();
  });
}

export function postLeaderAtList({ name, time, isHard, isMagic }) {
  const achievements = [];
  if (isHard) {
    achievements.push(1);
  }
  if (isMagic) {
    achievements.push(2);
  }
  return fetch("https://wedev-api.sky.pro/api/v2/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name: name.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
      time,
      achievements,
    }),
  }).then(response => response.json());
}
