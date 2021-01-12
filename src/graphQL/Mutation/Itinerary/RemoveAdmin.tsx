import { gql } from 'apollo-boost';
const RemoveAdmin = gql`
	mutation($buddy_id: ID!, $itinerary_id: ID!) {
		remove_admin(buddy_id: $buddy_id, itinerary_id: $itinerary_id) {
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
export default RemoveAdmin;
