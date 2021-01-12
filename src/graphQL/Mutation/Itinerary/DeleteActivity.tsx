import { gql } from 'apollo-boost';
const DeleteActivity = gql`
	mutation($itinerary_id: ID!, $id_activity: ID!, $type: String!) {
		delete_activity(
			itinerary_id: $itinerary_id
			id_activity: $id_activity
			type: $type
		) {
			id
			isprivate
			response_time
			message
			code
		}
	}
`;
export default DeleteActivity;
