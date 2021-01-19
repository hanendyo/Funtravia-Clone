import { gql } from 'apollo-boost';
const AddCommentJournal = gql`
	mutation($id: ID!, $text: String) {
		comment_journal(input: { travel_journal_id: $id, text: $text }) {
			id
			response_time
			message
			code
		}
	}
`;
export default AddCommentJournal;
