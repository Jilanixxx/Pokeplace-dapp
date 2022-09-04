import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddCard from "./AddCard";
import PokeCard from "./Card";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
	getCards as getCardList,
	buyCard,
	createCard,
	deleteCard,
	sellCard,
	unlistCard,
} from "../../utils/marketplace";

const Cards = ({ accountId }) => {
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(false);

	// function to get the list of cards
	const getCards = useCallback(async () => {
		try {
			setLoading(true);
			setCards(await getCardList());
		} catch (error) {
			console.log({ error });
		} finally {
			setLoading(false);
		}
	});

	const addCard = async (data) => {
		try {
			setLoading(true);
			createCard(data).then((resp) => {
				getCards();
			});
			toast(<NotificationSuccess text="Pokecard added successfully." />);
		} catch (error) {
			console.log({ error });
			toast(<NotificationError text="Failed to add Pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	const buy = async (id, price) => {
		try {
			setLoading(true);
			await buyCard({
				id,
				price,
			}).then((resp) => getCards());
			toast(<NotificationSuccess text="Pokecard bought successfully" />);
		} catch (error) {
			toast(<NotificationError text="Failed to purchase pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	const remove = async (id) => {
		try {
			setLoading(true);
			await deleteCard({
				id,
			}).then((resp) => getCards());
			toast(<NotificationSuccess text="Pokecard removed successfully" />);
		} catch (error) {
			toast(<NotificationError text="Failed to remove pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	const unlist = async (id) => {
		try {
			setLoading(true);
			await unlistCard({
				id,
			}).then((resp) => getCards());
			toast(
				<NotificationSuccess text="Pokecard unlisted successfully" />
			);
		} catch (error) {
			toast(<NotificationError text="Failed to unlist pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	const sell = async (id, price) => {
		try {
			setLoading(true);
			await sellCard({
				id,
				price,
			}).then((resp) => getCards());
			toast(
				<NotificationSuccess text="Pokecard's sale successfully created" />
			);
		} catch (error) {
			toast(<NotificationError text="Failed to sell pokecard." />);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getCards();
	}, []);

	return (
		<>
			{!loading ? (
				<>
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h1 className="fs-4 fw-bold mb-0">Poke Place</h1>
						<AddCard save={addCard} />
					</div>
					<Row
						xs={1}
						sm={2}
						lg={3}
						className="g-3  mb-5 g-xl-4 g-xxl-5"
					>
						{cards.map((_card) => (
							<PokeCard
								key={_card.id}
								card={{
									..._card,
								}}
								buy={buy}
								sell={sell}
								unlist={unlist}
								remove={remove}
								accountId={accountId}
							/>
						))}
					</Row>
				</>
			) : (
				<Loader />
			)}
		</>
	);
};

export default Cards;
