import { gql } from 'apollo-boost';
const Phone = gql`
	mutation($phone: String!) {
		login_phone(input: { phone: $phone }) {
			id
			response_time
			message
			code
		}
	}
`;
export default Phone;
