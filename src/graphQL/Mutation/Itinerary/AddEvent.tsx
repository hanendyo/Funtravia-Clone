import { gql } from 'apollo-boost';
const AddEvent = gql`
	mutation($day_id: [ID]!, $event_id: ID!) {
		add_event(input: { day_id: $day_id, event_id: $event_id, status: false }) {
			id
			response_time
			message
			code
		}
	}
`;
export default AddEvent;
