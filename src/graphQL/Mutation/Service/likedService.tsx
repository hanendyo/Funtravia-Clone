import { gql } from 'apollo-boost';
const likedServices = gql`
	mutation($service_id: ID!) {
		setService_wishlist(service_id: $service_id, qty: 1) {
			response_time
			message
			status
			code
		}
	}
`;
export default likedServices;
