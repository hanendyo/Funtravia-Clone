import { gql } from 'apollo-boost';
const deletepost = gql`
	mutation($post_id: ID!) {
		delete_post(post_id: $post_id) {
			id
			response_time
			message
			code
		}
	}
`;
export default deletepost;
