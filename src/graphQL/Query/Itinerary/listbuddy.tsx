import { gql } from 'apollo-boost';
const Listbuddy = gql`
	query($itinerary_id: ID!, $key: String) {
		list_buddy(itinerary_id: $itinerary_id, key: $key) {
			id
			user_id
			isadmin
			isconfrim
			username
			first_name
			last_name
			picture
			accepted_at
			rejected_at
		}
	}
`;
export default Listbuddy;
