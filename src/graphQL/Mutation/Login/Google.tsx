import { gql } from "apollo-boost";
const Google = gql`
  mutation($token: String!, $pushtoken: String) {
    login_google(input: { client_token: $token, token: $pushtoken }) {
      data_setting {
        user_id
        countries {
          id
          name
          code
          description
          map
          flag
          suggestion
        }
        currency {
          id
          name
          code
        }
        cities {
          id
          name
        }
        aktivasi_akun
        price_notif
        status_order_and_payment
        hotels_and_flight_info
        funtravia_promo
        review_response
        payment_remender
        user {
          id
          first_name
          last_name
          username
          bio
          email
          phone
          password
          birth_date
          gender
          picture
          created_at
          updated_at
        }
      }
      access_token
      expires_at
      token_type
      response_time
      response_time
      message
      status
      code
      user {
        id
        first_name
        last_name
        username
        bio
        email
        phone
        created_at
        updated_at
      }
    }
  }
`;
export default Google;
