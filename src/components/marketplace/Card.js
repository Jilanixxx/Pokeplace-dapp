import React, { useState } from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import {
	Card,
	Button,
	Col,
	Badge,
	Stack,
	Form
} from "react-bootstrap";

const PokeCard = ({ card, buy, sell, remove, unlist, accountId }) => {
	const { id, price, name, description, sold, image, owner } = card;

	const [newPrice, setNewPrice] = useState("");
	const triggerBuy = () => {
		buy(id, price);
	};

	const triggerSell = () => {
		sell(id, newPrice);
	};

	const triggerRemove = () => {
		remove(id);
	};

	const triggerUnlist = () => {
		unlist(id);
	};

	const getAction = () => {
		if (accountId === owner) {
			if (sold) {
				return (
					<Stack direction="vertical" gap={2}>
						<Form.Control
							type="text"
							placeholder="Enter price"
							value={newPrice}
							onChange={(e) => setNewPrice(e.target.value)}
						/>
						<Button onClick={triggerSell} variant="outline-success">
							Sell
						</Button>
						<Button
							onClick={triggerRemove}
							variant="outline-danger"
						>
							Remove
						</Button>
					</Stack>
				);
			} else {
				return (
					<Button onClick={triggerUnlist} variant="outline-warning">
						Unlist
					</Button>
				);
			}
		} else {
			if(!sold){
				return (
					<Button onClick={triggerBuy} variant="outline-dark">
						Buy for {utils.format.formatNearAmount(price)} NEAR
					</Button>
				);
			}else{
				return "";
			}
		}
	};
	return (
		<Col key={id}>
			<Card className=" h-100">
				<Card.Header>
					<Stack direction="horizontal" gap={2}>
						<span className="font-monospace text-secondary">
							{owner}
						</span>
						<Badge bg="secondary" className="ms-auto">
							{sold ? "Sold" : "Sale"}
						</Badge>
					</Stack>
				</Card.Header>
				<div className=" ratio ratio-4x3">
					<img
						src={image}
						alt={name}
						style={{ objectFit: "cover" }}
					/>
				</div>
				<Card.Body className="d-flex  flex-column text-center">
					<Card.Title>{name}</Card.Title>
					<Card.Text className="flex-grow-1 ">
						{description}
					</Card.Text>
					{getAction()}
				</Card.Body>
			</Card>
		</Col>
	);
};

PokeCard.propTypes = {
	card: PropTypes.instanceOf(Object).isRequired,
	buy: PropTypes.func.isRequired,
};

export default PokeCard;
