import { gql } from 'apollo-boost';
const AddGoogle = gql`
	mutation($itinerary_id: ID!, $buddy_id: ID!) {
		delete_buddy(buddy_id: $buddy_id, itinerary_id: $itinerary_id) {
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
export default AddGoogle;
