import { Card, cardsStorage } from "./model";
import { context, ContractPromiseBatch, u128} from "near-sdk-as";

// 1 Near
const minPrice = u128.from(1000000000000000000000000);

// buy a card
export function buyCard(cardId: string): void {
	const card = getCard(cardId);
	if (card == null) {
		throw new Error("card not found");
	}
	assert(card.sold == false, "Not for sale");
	assert(
		card.price.toString() == context.attachedDeposit.toString(),
		"attached deposit should be equal to the card's price"
	);
	assert(
		card.owner.toString() != context.sender.toString(),
		"owner can't buy"
	);
	ContractPromiseBatch.create(card.owner).transfer(context.attachedDeposit);
	card.buy();
	cardsStorage.set(card.id, card);
}

// delete a card
export function deleteCard(cardId: string): void {
	const card = getCard(cardId);
	if (card == null) {
		throw new Error("card not found");
	}
	assert(card.owner.toString() == context.sender.toString(), "only owner");
	// card removed from storage
	cardsStorage.delete(cardId);
}

// sell a card
export function sellCard(cardId: string, price: u128): void {
	const card = getCard(cardId);
	if (card == null) {
		throw new Error("card not found");
	}
	assert(price >= minPrice, "price too low");
	assert(card.owner.toString() == context.sender.toString(), "only owner");
	card.sell(price);
	cardsStorage.set(card.id, card);
}

// unlist a card
export function unlistCard(cardId: string): void {
	const card = getCard(cardId);
	if (card == null) {
		throw new Error("card not found");
	}
	assert(card.owner.toString() == context.sender.toString(), "only owner");
	card.unlist();
	cardsStorage.set(card.id, card);
}

// create a card
export function setCard(card: Card): void {
	let storedcard = cardsStorage.get(card.id);
	if (storedcard !== null) {
		throw new Error(`a card with id=${card.id} already exists`);
	}
	assert(card.price >= minPrice, "price too low");
	cardsStorage.set(card.id, Card.fromPayload(card));
}

/**
 *
 * A function that returns a single card for given owner and card id
 *
 * @param id - an identifier of a card to be returned
 * @returns a card for a given @param id
 */
export function getCard(id: string): Card | null {
	return cardsStorage.get(id);
}

/**
 *
 * A function that returns an array of cards for all accounts
 *
 * @returns an array of objects that represent a card
 */
export function getCards(): Array<Card> {
	return cardsStorage.values();
}
