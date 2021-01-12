import { gql } from 'apollo-boost';
const unliked = gql`
	mutation($id: ID!, $type: String!) {
		unset_wishlist(id: $id, type: $type) {
			response_time
			message
			status
			code
		}
	}
`;
export default unliked;
