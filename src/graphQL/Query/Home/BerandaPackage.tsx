import { gql } from 'apollo-boost';
const BerandaPackage = gql`
	query {
		beranda_package {
			id
			name
			available
			price
			day
			night
			cover
			city{
				id
				name
			}
			vendor{
				id
				name
			}
		}
	}
`;
export default BerandaPackage;
