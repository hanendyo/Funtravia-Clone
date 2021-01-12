import { gql } from 'apollo-boost';
const getParams = gql`
	query($code: String!) {
		get_params(code: $code) {
			id
			code
			value
			description
		}
	}
`;
export default getParams;
