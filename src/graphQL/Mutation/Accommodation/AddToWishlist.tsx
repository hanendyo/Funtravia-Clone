import { gql } from 'apollo-boost';
const addToWishlistAccommodation = gql`
	mutation($id: ID!) {
		setAccomodation_wishlist(accomodation_id: $id, qty: 1) {
			response_time
			message
			status
			code
		}
	}
`;
export default addToWishlistAccommodation;
