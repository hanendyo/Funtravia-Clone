import { gql } from 'apollo-boost';
const AddBuddy = gql`
	mutation($user_id: [ID]!, $itinerary_id: ID!) {
		add_buddy(user_id: $user_id, itinerary_id: $itinerary_id) {
			data_buddy {
				id
				user_id
				isadmin
				isconfrim
				user {
					id
					username
					first_name
					last_name
					picture
				}
			}
			response_time
			message
			code
		}
	}
`;
export default AddBuddy;
