import { gql } from 'apollo-boost';
const IsRead = gql`
	mutation($notif_id: ID!) {
		update_read(notif_id: $notif_id) {
			id
			response_time
			message
			code
		}
	}
`;
export default IsRead;
