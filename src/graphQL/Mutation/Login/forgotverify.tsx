import { gql } from 'apollo-boost';
const FORGOT = gql`
	mutation Login(
		$email: String!
		$otp: Int!
		$password: String!
		$conf_password: String!
	) {
		updateForgottenPassword(
			input: {
				email: $email
				otp_code: $otp
				password: $password
				password_confirmation: $conf_password
			}
		) {
			code
			status
			message
			response_time
			email
		}
	}
`;
export default FORGOT;
