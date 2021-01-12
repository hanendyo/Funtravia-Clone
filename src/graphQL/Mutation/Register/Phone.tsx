import { gql } from 'apollo-boost';
const Phone = gql`
	mutation($nomor: String!) {
		register_phone(input: { phone: $nomor }) {
			id
			response_time
			message
			code
		}
	}
`;
export default Phone;
