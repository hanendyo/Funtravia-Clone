import { gql } from 'apollo-boost';
const AddDestination = gql`
	mutation($day: [ID]!, $idDestination: ID!) {
		add_destination(
			input: { day_id: $day, destination_id: $idDestination, status: false }
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default AddDestination;
