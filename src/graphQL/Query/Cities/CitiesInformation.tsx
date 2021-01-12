import { gql } from 'apollo-boost';
const CitiesInformation = gql`
	query($id: ID!) {
		CitiesInformation(id: $id) {
			id
			name
			code
			latitude
			longitude
			description
			countries {
				id
				name
				flag
			}
			map
			cover {
				image
			}
			images {
				image
			}
		}
	}
`;
export default CitiesInformation;
