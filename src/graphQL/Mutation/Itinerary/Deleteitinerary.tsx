import { gql } from 'apollo-boost';
const Deleteitinerary = gql`
	mutation($id: ID!) {
		delete_itinerary(itinerary_id: $id) {
			id
			isprivate
			response_time
			message
			code
		}
	}
`;
export default Deleteitinerary;
