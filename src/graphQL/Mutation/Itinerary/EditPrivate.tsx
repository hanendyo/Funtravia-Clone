import { gql } from 'apollo-boost';
const UpdateTimeline = gql`
	mutation($id: ID!) {
		change_publication(itinerary_id: $id) {
			isprivate
			id
			response_time
			message
			code
		}
	}
`;
export default UpdateTimeline;
