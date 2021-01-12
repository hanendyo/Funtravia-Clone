import { gql } from 'apollo-boost';
const Updatecover = gql`
	mutation($itinerary_id: ID!, $cover: String!) {
		update_cover_itinerary(itinerary_id: $itinerary_id, cover: $cover) {
			id
			response_time
			message
			code
		}
	}
`;
export default Updatecover;
