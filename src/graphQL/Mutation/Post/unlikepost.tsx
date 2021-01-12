import { gql } from 'apollo-boost';
const unlikepost = gql`
	mutation($post_id: ID!) {
		unlike_post(post_id: $post_id) {
			count_like
			response_time
			message
			code
		}
	}
`;
export default unlikepost;
