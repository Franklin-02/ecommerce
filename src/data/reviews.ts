import type { Review } from "@/types/commerce";
import { customers } from "./customers";
import { products } from "./products";
import { dayKey, pick, seededRandom } from "./seed";

const byCategory: Record<string, [string, string][]> = {
  cat_phones: [
    ["Camera is the real upgrade", "Low-light shots came out far cleaner than my old phone, and the battery comfortably lasts a full day of heavy use."],
    ["Fast and feels premium", "Apps open instantly and the screen is gorgeous outdoors. It runs a little warm while charging, but nothing worrying."],
  ],
  cat_mobile_acc: [
    ["Fits perfectly", "Cutouts line up exactly and it survived a drop onto concrete with no marks on the phone."],
    ["Good value", "Feels well made for the price. Still looks new after two months in a bag with my keys."],
  ],
  cat_chargers: [
    ["Charges everything I own", "Replaced three separate bricks. It stays cool and tops up my laptop at full speed."],
    ["Small and powerful", "Much smaller than I expected. It's now the only charger I travel with."],
  ],
  cat_power_banks: [
    ["Saved me on a long trip", "Got through two full phone charges and a tablet top-up during a long power cut."],
    ["The display is genuinely useful", "Knowing the exact percentage beats guessing from four dots. Recharges quickly too."],
  ],
  cat_audio: [
    ["Wonderful sound for the price", "Clear mids and bass that doesn't overwhelm. Noise cancelling erases the office hum completely."],
    ["Comfortable all day", "I wear these for whole work days with no ear fatigue. Pairing with two devices is seamless."],
  ],
  cat_speakers: [
    ["Bigger sound than it looks", "Fills my whole terrace without distorting, and it shrugged off a sudden monsoon shower."],
    ["Easy setup, great audio", "Up and running in five minutes. Dialogue is much clearer than through the TV."],
  ],
  cat_computing: [
    ["A pleasure to use daily", "Quiet, solid and exactly as responsive as I wanted. It has quickly become part of my daily setup."],
    ["Great build quality", "Nothing creaks or flexes. Works perfectly across my work laptop and home desktop."],
  ],
  cat_watches: [
    ["Accurate tracking", "Heart rate matched my chest strap on runs and the GPS locks on in seconds."],
    ["Battery beats the competition", "I charge it about once a week. Sleep tracking has genuinely changed my routine."],
  ],
  cat_electrical: [
    ["Solid and well spaced", "Big adapters no longer block the neighbouring sockets, and the switch feels robust."],
    ["Peace of mind", "Exactly what I wanted protecting my desk setup. The cord is thick and well made."],
  ],
  cat_lighting: [
    ["Transformed the room", "Setup took minutes and the colours are rich rather than washed out. Schedules work reliably."],
    ["Lovely warm light", "Dims smoothly with no flicker and looks great in an open fixture."],
  ],
  cat_smart_home: [
    ["Just works", "Joined my network the first time and hasn't dropped since. The app is clean and quick."],
    ["Great addition to the house", "Notifications arrive promptly and are accurate. I've had almost no false alerts."],
  ],
  cat_networking: [
    ["Dead zones are gone", "Full speed in the upstairs office for the first time. Setup was simple and the app is clear."],
    ["Rock-solid connection", "Hasn't needed a single restart in months, even with thirty devices connected."],
  ],
};

const critical: [string, string] = [
  "Good, with one complaint",
  "Does everything it promises, though delivery took a day longer than quoted and the instructions could be clearer.",
];

const random = seededRandom(7713);

export const reviews: Review[] = products.flatMap((product) => {
  const pool = byCategory[product.categoryId];
  return [...pool, critical].map(([title, body], index) => {
    const isCritical = index === pool.length;
    return {
      id: `rev_${product.id}_${index}`,
      productId: product.id,
      author: pick(random, customers).name,
      rating: isCritical ? 3 + Math.floor(random() * 2) : random() < 0.7 ? 5 : 4,
      title,
      body,
      date: dayKey(3 + Math.floor(random() * 160)),
      verified: random() < 0.85,
      helpful: Math.floor(random() * 42),
    };
  });
});
