import { gql } from 'apollo-boost';
const AddDay = gql`
	mutation($id: ID!, $date: String!, $day: String!) {
		add_dayitinerary(input: { id_itinerary: $id, date: $date, day: $day }) {
			dataday {
				id
				itinerary_id
				day
				date
			}
			response_time
			message
			code
		}
	}
`;
export default AddDay;
