import { gql } from 'apollo-boost';
const RejectInvitation = gql`
	mutation($buddy_id: ID!) {
		reject_buddy(buddy_id: $buddy_id) {
			data_itin {
				id
				name
				cover
				country_id
				city_id
				start_date
				end_date
				isprivate
				status
				created_by
				updated_by
				created_at
				updated_at
			}
			response_time
			message
			code
		}
	}
`;
export default RejectInvitation;
