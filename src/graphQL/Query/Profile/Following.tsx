import { gql } from 'apollo-boost';
const FollowingQuery = gql`
	query {
		user_following {
			id
			username
			first_name
			last_name
			picture
			bio
		}
	}
`;
export default FollowingQuery;
