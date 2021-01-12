import { gql } from 'apollo-boost';
const VerificationLoginPhone = gql`
	mutation($phone: String!, $otp_code: Int!, $token: String) {
		login_phone_verification(
			input: { phone: $phone, otp_code: $otp_code, token: $token }
		) {
			access_token
			expires_at
			token_type
			response_time
			message
			status
			code
		}
	}
`;
export default VerificationLoginPhone;
