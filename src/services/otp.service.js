const axios = require('axios');

const sendOtp = async val => {
  try {
    const { data } = await axios.get(
      `http://bhashsms.com/api/sendmsg.php?user=ameenreddy&pass=123&sender=TEINNO&phone=${val.phone}&text=Dear%20Customer,%20${val.otp}%20is%20your%20OTP.%20Do%20not%20share%20this%20OTP%20with%20anyone.%20Thank%20you.%20-%20TEINNO&priority=ndnd&stype=normal`
    );
    return data;
  } catch (e) {
    throw new Error('SMS failed to send');
  }
};

module.exports = { sendOtp };
