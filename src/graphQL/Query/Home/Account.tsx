import { gql } from 'apollo-boost';
const Account = gql`
	query {
		user_profile {
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
			email
			phone
			count_wishlist
			count_itinerary_favorit
			count_my_itinerary
		}
	}
`;
export default Account;
