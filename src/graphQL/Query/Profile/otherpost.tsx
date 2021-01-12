import { gql } from 'apollo-boost';
const post = gql`
	query($id: ID!) {
		user_postbyid(id: $id) {
			id
			caption
			longitude
			latitude
			comment_count
			response_count
			created_at
			updated_at
			liked
			location_name
			assets {
				id
				type
				filepath
			}
		}
	}
`;
export default post;
