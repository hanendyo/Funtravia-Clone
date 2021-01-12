import { gql } from 'apollo-boost';
const FollowMut = gql`
	mutation($id: ID!) {
		follow_user(id: $id) {
			id_follow
			response_time
			message
			code
		}
	}
`;
export default FollowMut;
