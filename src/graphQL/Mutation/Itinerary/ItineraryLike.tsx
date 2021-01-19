import { gql } from 'apollo-boost';

const ItineraryLiked = gql`
	mutation($id: ID!, $qty: Int) {
		setItineraryFavorit(itinerary_id: $id, qty: $qty) {
			response_time
			message
			status
			code
		}
	}
`;

export default ItineraryLiked;
