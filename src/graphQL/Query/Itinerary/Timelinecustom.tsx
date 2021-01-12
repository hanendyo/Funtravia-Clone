import { gql } from 'apollo-boost';
const Timeline = gql`
	query($id: ID!) {
		custome_timeline(day_id: $id) {
			id
			timeline {
				id
				type
				name
				note
				time
				order
				qty
				duration
				address
				latitude
				longitude
				total_price
				images
				status
				icon
			}
			total_hours
		}
	}
`;
export default Timeline;
