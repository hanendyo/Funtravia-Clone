import { gql } from 'apollo-boost';
const SearchUserQuery = gql`
	query($keyword: String) {
		user_search_feed(key: { keyword: $keyword }) {
			id
			username
			first_name
			last_name
			picture
			bio
			status_follower
			status_following
		}
	}
`;
export default SearchUserQuery;
