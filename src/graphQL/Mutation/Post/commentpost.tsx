import { gql } from 'apollo-boost';
const commentpost = gql`
	mutation($post_id: ID!, $text: String) {
		comment_post(input: { post_id: $post_id, text: $text }) {
			id
			response_time
			message
			code
		}
	}
`;
export default commentpost;
