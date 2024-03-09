export function getLeadersList() {
  return fetch(" https://wedev-api.sky.pro/api/leaderboard", {
    method: "GET",
  }).then(response => {
    if (!response.ok) {
      throw new Error("ошибка сервера");
    }
    return response.json();
  });
}

export function postLeaderAtList({ name, time }) {
  return fetch("https://wedev-api.sky.pro/api/leaderboard", {
    method: "POST",
    body: JSON.stringify({
      name: name.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
      time: time,
    }),
  }).then(response => response.json());
}
