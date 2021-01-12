import { gql } from 'apollo-boost';

const RESEND = gql`
	mutation($user_id: String!, $email: String!) {
		resend_email_verification(input: { user_id: $user_id, email: $email }) {
			id
			response_time
			message
			code
		}
	}
`;

export default RESEND;
