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
				detail_flight{
					id
					title
					departure
					arrival
					from
					latitude_departure
					longitude_departure
					latitude_arrival
					longitude_arrival
					destination
					guest_name
					booking_ref
					carrier
				}
			}
			total_hours
		}
	}
`;
export default Timeline;
