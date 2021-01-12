import { gql } from 'apollo-boost';
const UnfollowMut = gql`
	mutation($id: ID!) {
		unfollow_user(id: $id) {
			id_follow
			response_time
			message
			code
		}
	}
`;
export default UnfollowMut;
