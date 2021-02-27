const path=require('path');

require('dotenv').config({path:path.resolve(__dirname, '../../.env') });

//Setting up functionality for random-otp generation
const GetOtp=()=>{
      const val=Math.floor(Math.random()*1000000);
      if (val.toString().length==5)
      {
            val*=10;
      }
      return val;
}

//Helper function to generate a email body
const EmailBody=(emailid,otp)=>{
      const message={
            from:process.env.TEST_MAIL,
            to:emailid.toString(),
            subject:'Thanks for registering.Here is your verification OTP!',
            text:'Your verification OTP is '+otp.toString()+'\nThe OTP should be used within 30 min otherwise all your data will be erased from the database and you will be obliged to redo the registration process.'
      };
      return message;
}

//Helper function to generate a message body
const MessageBody=(otp)=>{
      return 'Greetings from the Team!\n'+'Your verification OTP is '+otp.toString()+'\nThe OTP should be used within 30 min otherwise all your data will be erased from the database and you will be obliged to redo the registration process.';
}

//Helper to verify the otps sent to the user and the ones entered by the user.
const Verificationutil=(user,otpobj)=>{
      const len1=user.RecentEmailOtps.length;
      const len2=user.RecentMobileOtps.length;
      const final=user.RecentEmailOtps[len1-1]==otpobj.body.otp1 && user.RecentMobileOtps[len2-1]==otpobj.body.otp2;
      return final;          
}


module.exports={EmailBody,MessageBody,GetOtp,Verificationutil};

