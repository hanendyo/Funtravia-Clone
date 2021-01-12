import { gql } from 'apollo-boost';
const FeedByID = gql`
	query($post_id: ID!) {
		feed_post_byid(post_id: $post_id) {
			id
			caption
			longitude
			latitude
			location_name
			liked
			comment_count
			response_count
			created_at
			updated_at
			assets {
				id
				type
				filepath
			}
			user {
				id
				username
				first_name
				last_name
				picture
				ismyfeed
			}
		}
	}
`;
export default FeedByID;
