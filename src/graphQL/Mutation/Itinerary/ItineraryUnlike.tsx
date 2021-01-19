import { gql } from 'apollo-boost';

const ItineraryUnliked = gql`
	mutation($id: ID!) {
		unsetItineraryFavorit(itinerary_id: $id) {
			response_time
			message
			status
			code
		}
	}
`;

export default ItineraryUnliked;
