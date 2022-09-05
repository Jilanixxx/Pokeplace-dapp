import { PersistentUnorderedMap, context, u128 } from "near-sdk-as";


@nearBindgen
export class Card {
    id: string;
    owner: string;
    name: string;
    description: string;
    image: string;
    price: u128;
    sold: boolean;
    public static fromPayload(payload: Card): Card {
        const card = new Card();
        card.id = payload.id;
        card.owner = context.sender;
        card.name = payload.name;
        card.description = payload.description;
        card.image = payload.image;
        card.price = payload.price;
        card.sold = false;
        return card;
    }
    public buy(): void {
        this.sold = true;
        this.owner = context.sender;
        this.price = u128.Zero;
    }

    public sell(price :u128): void {
        this.sold = false;
        this.price = price;
    }
    public unlist(): void {
        this.sold = true;
        this.price = u128.Zero;
    }
}


export const cardsStorage = new PersistentUnorderedMap<string, Card>("LISTED_CARDS");

export const ownedCardsStorage = new PersistentUnorderedMap<string, string[]>("OWNED_CARDS");