import { gql } from 'apollo-boost';
const CommentList = gql`
	query($post_id: ID) {
		comment(post_id: $post_id) {
			id
			user {
				id
				username
				first_name
				last_name
				picture
			}
			text
			created_at
			updated_at
		}
	}
`;
export default CommentList;
