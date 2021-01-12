import { gql } from 'apollo-boost';
const FollowingQuery = gql`
	query($id: ID!) {
		user_followingbyid(id: $id) {
			id
			username
			first_name
			last_name
			picture
			bio
			status
		}
	}
`;
export default FollowingQuery;
