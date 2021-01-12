import { gql } from 'apollo-boost';
const Category = gql`
	query {
		service_type {
			id
			name
			description
			icon
		}
	}
`;
export default Category;
