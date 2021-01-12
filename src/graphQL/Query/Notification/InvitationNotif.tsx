import { gql } from 'apollo-boost';
const InvitationNotif = gql`
	query {
		list_notivication_invite {
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
			user_invite {
				id
				username
				first_name
				last_name
				picture
			}
			accepted_at
			rejected_at
			itinerary_id
		}
	}
`;
export default InvitationNotif;
