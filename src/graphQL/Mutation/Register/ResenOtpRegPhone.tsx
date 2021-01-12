import { gql } from 'apollo-boost';

const RESEND = gql`
	mutation($nomor: String!) {
		register_phone_resend_verification(input: { phone: $nomor }) {
			id
			response_time
			message
			code
		}
	}
`;

export default RESEND;
