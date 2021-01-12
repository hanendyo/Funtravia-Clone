import { gql } from 'apollo-boost';
const OTP = gql`
	mutation Otp($user_id: ID!, $otp_code: Int!) {
		verification(input: { user_id: $user_id, otp_code: $otp_code }) {
			access_token
			refresh_token
			token_type
			response_time
			message
			status
			code
		}
	}
`;

export default OTP;
