import { gql } from 'apollo-boost';
const JournalList = gql`
	query($id: ID!) {
		journal_byid(travel_journal_id: $id) {
			id
			title
			date
			firstimg
			firsttxt
			article_comment_count
			article_response_count
			created_at
			updated_at
			article {
				id
				type
				title
				text
				image
				order
			}
			userby {
				id
				first_name
				last_name
				username
				bio
				created_at
				status_follower
				status_following
				picture
			}
			cities {
				id
				name
				code

				latitude
				longitude
				description
			}
			countries {
				id
				name
				code
				description
				flag
				capital
				currency_name
				currency_symbol
				currency_code
				flag
				map
			}
			province {
				id
				code
				name
				description
				map
			}
			destination {
				id
				name
				latitude
				longitude
			}
		}
	}
`;
export default JournalList;
