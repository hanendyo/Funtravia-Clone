import { gql } from 'apollo-boost';
const unlikedJournal = gql`
	mutation($id_id: ID!) {
		setEvent_wishlist(travel_journal_id: $id, qty: 1) {
			count_like
			response_time
			message
			code
		}
	}
`;
export default unlikedJournal;
