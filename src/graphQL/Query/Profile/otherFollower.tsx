import { gql } from 'apollo-boost';
const FollowerQuery = gql`
	query($id: ID!) {
		user_followersbyid(id: $id) {
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
