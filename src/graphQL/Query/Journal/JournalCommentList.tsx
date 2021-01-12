import { gql } from 'apollo-boost';
const JournalList = gql`
	query($id: ID!) {
		comment_journal_list(travel_journal_id: $id) {
			id
			user {
				id
				username
				first_name
				last_name
				picture
			}
			text
			created_at
			updated_at
		}
	}
`;
export default JournalList;
