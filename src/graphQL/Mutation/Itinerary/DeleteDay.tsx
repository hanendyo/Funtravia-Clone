import { gql } from 'apollo-boost';
const DeleteDay = gql`
	mutation($itinerary_id: ID!, $day_id: ID!) {
		delete_day(itinerary_id: $itinerary_id, day_id: $day_id) {
			id
			isprivate
			response_time
			message
			code
		}
	}
`;
export default DeleteDay;
