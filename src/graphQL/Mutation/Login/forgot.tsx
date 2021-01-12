import { gql } from 'apollo-boost';

const FORGOT = gql`
	mutation Login($email: String!) {
		forgotPassword(input: { email: $email }) {
			code
			status
			message
			response_time
			email
		}
	}
`;

export default FORGOT;
