import { gql } from 'apollo-boost';
const EditProfile = gql`
	mutation(
		$first_name: String!
		$last_name: String
		$username: String!
		$bio: String
	) {
		update_profile(
			first_name: $first_name
			last_name: $last_name
			username: $username
			bio: $bio
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default EditProfile;
