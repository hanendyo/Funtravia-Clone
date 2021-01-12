import { gql } from 'apollo-boost';
const Email = gql`
	mutation(
		$first_name: String!
		$last_name: String!
		$email: String!
		$phone: String!
		$password: String!
		$password_confirmation: String!
		$token: String
	) {
		register(
			input: {
				first_name: $first_name
				last_name: $last_name
				email: $email
				phone: $phone
				password: $password
				password_confirmation: $password_confirmation
				token: $token
			}
		) {
			id
			response_time
			message
			code
		}
	}
`;
export default Email;
