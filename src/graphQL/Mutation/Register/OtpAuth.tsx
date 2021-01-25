import { gql } from "apollo-boost";
const OtpAuth = gql`
  mutation Otp($user_id: ID!, $otp_code: Int!, $token: String!) {
    verification(
      input: { user_id: $user_id, otp_code: $otp_code, token: $token }
    ) {
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
      refresh_token
      token_type
      response_time
      message
      status
      code
    }
  }
`;

export default OtpAuth;
