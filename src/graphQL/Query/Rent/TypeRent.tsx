import { gql } from 'apollo-boost';
const TypeRent = gql`
	query {
		trans_type {
			id
			name
			sugestion
			checked
			show
		}
	}
`;
export default TypeRent;
