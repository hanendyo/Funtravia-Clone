import { gql } from 'apollo-boost';
const ChangeStatus = gql`
	mutation($id: ID!, $status: String!) {
		change_status(itinerary_id: $id, status: $status) {
			id
			isprivate
			response_time
			message
			code
		}
	}
`;
export default ChangeStatus;
