import nodemailer from 'nodemailer'


class SendEmail {
  
  static async sendResetPasswordEmail(userEmail, resetEmail){       
     const mailTransporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME, 
          pass: process.env.EMAIL_PASSWORD, 
        },
      });
      // send mail with defined transport object
      const options ={
        from:'hamza.benkhoud@etudiant-isi.utm.tn',
        to: userEmail, // list of receivers
        subject: "Password Reset Request", // Subject line
        html: `<a href=${resetEmail}>Click Here to reset Password</a>` // html body
      }
      try{
        let info = await mailTransporter.sendMail(options);
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      }catch(error){
        console.log(error)
        throw error
      }
   }

}





export default SendEmail