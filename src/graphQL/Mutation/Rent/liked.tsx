import { gql } from 'apollo-boost';
const liked = gql`
	mutation($transportation_id: ID!) {
		setTransportation_wishlist(transportation_id: $transportation_id, qty: 1) {
			response_time
			message
			status
			code
		}
	}
`;
export default liked;
