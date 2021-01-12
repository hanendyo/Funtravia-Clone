import { gql } from 'apollo-boost';
const Other = gql`
	query($id: ID!) {
		user_profilebyid(id: $id) {
			id
			first_name
			last_name
			username
			bio
			picture
			point
			count_review
			count_post
			count_follower
			count_following
			joined
			status_follower
			status_following
		}
	}
`;
export default Other;
