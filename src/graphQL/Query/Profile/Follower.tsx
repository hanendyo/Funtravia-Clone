import { gql } from 'apollo-boost';
const FollowerQuery = gql`
	query {
		user_followers {
			id
			username
			first_name
			last_name
			picture
			status
			bio
		}
	}
`;
export default FollowerQuery;
