import { gql } from 'apollo-boost';
const likedEvent = gql`
	mutation($event_id: ID!) {
		setEvent_wishlist(event_id: $event_id, qty: 1) {
			response_time
			message
			status
			code
		}
	}
`;
export default likedEvent;
