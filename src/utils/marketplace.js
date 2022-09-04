import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function createCard(card) {
  card.id = uuid4();
  card.price = parseNearAmount(card.price + "");
  card.sold = false;
  return window.contract.setCard({ card }, GAS);
}

export function getCards() {
  return window.contract.getCards();
}

export async function buyCard({ id, price }) {
  await window.contract.buyCard({ cardId: id }, GAS, price);
}


export async function deleteCard({ id }) {
  await window.contract.deleteCard({ cardId: id }, GAS);
}

export async function sellCard({ id, price }) {
  price = parseNearAmount(price + "");
  await window.contract.sellCard({ cardId: id, price }, GAS);
}

export async function unlistCard({ id }) {
  await window.contract.unlistCard({ cardId: id }, GAS);
}