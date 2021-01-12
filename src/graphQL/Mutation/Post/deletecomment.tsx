import { gql } from 'apollo-boost';
const deletecomment = gql`
	mutation($comment_id: ID) {
		delete_comment_post(comment_id: $comment_id) {
			id
			response_time
			message
			code
		}
	}
`;
export default deletecomment;
