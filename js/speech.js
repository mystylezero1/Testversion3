const SPEECHES = [
    "🥂 Auf das Brautpaar! Zeit für ein Kaltgetränk.",
    "✨ Prost! Möge euer Abend unvergesslich werden.",
    "💃 Macht euch bereit für die Tanzfläche!",
    "🍰 Der Kuchen ruft – guten Appetit!",
    "❤️ Schön, dass du diesen besonderen Tag mit uns feierst!"
];

export function getRandomSpeech() {
    const index = Math.floor(Math.random() * SPEECHES.length);
    return SPEECHES[index];
}
