import { gql } from 'apollo-boost';
const filterDestination = gql`
	query {
		destination_type {
			id
			name
			sugestion
			checked
			show
		}
	}
`;
export default filterDestination;
