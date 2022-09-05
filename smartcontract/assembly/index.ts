import { Card, cardsStorage, ownedCardsStorage } from "./model";
import { context, ContractPromiseBatch, u128} from "near-sdk-as";

// 1 Near
const minPrice = u128.from(1000000000000000000000000);

/**
 *
 * A function that used to buy a card
 *
 * @param cardId - ID of the card
 */
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
		card.owner != context.sender.toString(),
		"owner can't buy"
	);

	let prevUserCards = ownedCardsStorage.get(card.owner);
	if(prevUserCards == null){
		prevUserCards = [];
	}
	const prevUserCardIndex = prevUserCards.indexOf(cardId);
	prevUserCards.splice(prevUserCardIndex, 1);
	ownedCardsStorage.set(card.owner, prevUserCards);

	ContractPromiseBatch.create(card.owner).transfer(context.attachedDeposit);
	card.buy();
	cardsStorage.set(card.id, card);

	let userCards = ownedCardsStorage.get(context.sender);
	if(userCards == null){
		userCards = [];
	}
	userCards.push(cardId);
	ownedCardsStorage.set(context.sender, userCards);
}

/**
 *
 * A function that used to delete a card
 *
 * @param cardId - ID of the card
 */
export function deleteCard(cardId: string): void {
	const card = getCard(cardId);
	if (card == null) {
		throw new Error("card not found");
	}
	assert(card.owner == context.sender.toString(), "only owner");

	// card removed from storage
	cardsStorage.delete(cardId);

	let userCards = ownedCardsStorage.get(context.sender);
	if(userCards == null){
		userCards = [];
	}
	const cardIndex = userCards.indexOf(cardId);
	userCards.splice(cardIndex, 1);

	ownedCardsStorage.set(context.sender, userCards);
}


/**
 *
 * A function that used to sell a card
 *
 * @param cardId - ID of the card
 * @param price - Price of the card
 */
export function sellCard(cardId: string, price: u128): void {
	const card = getCard(cardId);

	if (card == null) {
		throw new Error("card not found");
	}
	assert(price >= minPrice, "price too low");
	assert(card.owner == context.sender.toString(), "only owner");

	card.sell(price);
	cardsStorage.set(card.id, card);
}

/**
 *
 * A function that used to unlisted a card
 *
 * @param cardId - ID of the card
 */
export function unlistCard(cardId: string): void {
	const card = getCard(cardId);
	if (card == null) {
		throw new Error("card not found");
	}
	assert(card.owner == context.sender.toString(), "only owner");

	card.unlist();
	cardsStorage.set(card.id, card);
}

/**
 *
 * A function that create a new card
 *
 * @param card - Details of the card
 */
export function setCard(card: Card): void {
	let storedcard = cardsStorage.get(card.id);
	if (storedcard !== null) {
		throw new Error(`a card with id=${card.id} already exists`);
	}

	assert(card.name.length > 0, "Card name is required");
	assert(card.description.length > 0, "Card description is required");
	assert(card.image.length > 0, "Card image is required");
	assert(card.price >= minPrice, "price too low");

	cardsStorage.set(card.id, Card.fromPayload(card));

	let userCards = ownedCardsStorage.get(context.sender);
	if(userCards == null){
		userCards = [];
	}
	userCards.push(card.id);

	ownedCardsStorage.set(context.sender, userCards);
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

/**
 *
 * A function that returns an array of user cards for given accounts
 *
 * @param accountID ID of the account
 * @returns an array of objects that represent a card
 */
export function getUserCards(accountID: string): Array<Card> {
	let userCards: Card[] = [];

	const userCardIDs = ownedCardsStorage.get(accountID);

	if(userCardIDs != null){
		for(let i=0; i<userCardIDs.length; i++){
			if(cardsStorage.contains(userCardIDs[i])){
				userCards.push(cardsStorage.getSome(userCardIDs[i]));
			}
		}
	}

	return userCards;
}
