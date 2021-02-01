import { gql } from 'apollo-boost';
const likedJournal = gql`
	mutation($id: ID!) {
		like_journal(travel_journal_id: $id) {
			count_like
			response_time
			message
			code
		}
	}
`;
export default likedJournal;
