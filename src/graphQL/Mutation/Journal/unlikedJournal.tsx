import { gql } from 'apollo-boost';
const unlikedJournal = gql`
	mutation($id: ID!) {
		unlike_journal(travel_journal_id: $id) {
			count_like
			response_time
			message
			code
		}
	}
`;
export default unlikedJournal;
