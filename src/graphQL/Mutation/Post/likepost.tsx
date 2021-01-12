import { gql } from 'apollo-boost';
const likepost = gql`
	mutation($post_id: ID!) {
		like_post(post_id: $post_id) {
			count_like
			response_time
			message
			code
		}
	}
`;
export default likepost;
