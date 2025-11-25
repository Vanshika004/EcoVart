/**
 * estimateFootprint - estimates monthly CO2-equivalent footprint
 * @param {object} params
 * @param {number} params.commuteKmPerDay
 * @param {string} params.transportType - 'car' | 'bus' | 'bike'
 * @param {number} params.mealsPerWeek
 * @param {number} params.meatMealsPerWeek
 * @param {number} params.shoppingExpMonthly
 * @returns {{totalMonthly:number, commute:number, food:number, shopping:number}}
 */
export function estimateFootprint({
  commuteKmPerDay = 0,
  transportType = "car",
  mealsPerWeek = 0,
  meatMealsPerWeek = 0,
  shoppingExpMonthly = 0,
}) {
  const transportFactor =
    transportType === "car" ? 0.21 : transportType === "bus" ? 0.05 : 0.12;

  const commute = Number(commuteKmPerDay) * 30 * transportFactor;

  const meatPerMonth = (Number(meatMealsPerWeek) * 52) / 12;
  const otherPerMonth =
    ((Number(mealsPerWeek) - Number(meatMealsPerWeek)) * 52) / 12;
  const food = meatPerMonth * 2.5 + otherPerMonth * 0.8;

  const shopping = Number(shoppingExpMonthly) * 0.01;

  const totalMonthly = commute + food + shopping;

  return {
    totalMonthly: Number(totalMonthly.toFixed(2)),
    commute: Number(commute.toFixed(2)),
    food: Number(food.toFixed(2)),
    shopping: Number(shopping.toFixed(2)),
  };
}
