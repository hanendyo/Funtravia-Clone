import { gql } from 'apollo-boost';
const ListNotifikasi = gql`
	query {
		list_notification {
			id
			notification_type
			isread
			itinerary_buddy {
				id
				itinerary_id
				user_id
				isadmin
				isconfrim
				myuser {
					id
					username
					first_name
					last_name
					picture
				}
				userinvite {
					id
					username
					first_name
					last_name
					picture
				}
				accepted_at
				rejected_at
			}
			comment_feed {
				id
				post_id
				text
				user {
					id
					username
					first_name
					last_name
					picture
				}
				created_at
				updated_at
			}
			like_feed {
				id
				post_id
				response
				user {
					id
					username
					first_name
					last_name
					picture
				}
			}
			follow_user {
				user_req
				user_follow
				status
				user {
					id
					username
					first_name
					last_name
					picture
				}
			}
		}
	}
`;

export default ListNotifikasi;
