import { gql } from 'apollo-boost';
const SearchUserQuery = gql`
	query($keyword: String) {
		user_search(key: { keyword: $keyword }) {
			id
			username
			first_name
			last_name
			status
			picture
		}
	}
`;
export default SearchUserQuery;
