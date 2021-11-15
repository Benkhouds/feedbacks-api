

const sendRefreshToken = (res, token) => {
   res.cookie("jid", token, {
     httpOnly: true,
     path:'/api/v1/auth/refresh-token'
   });
};
const sendAccessToken = (res, user) => {
   const token = user.createAccessToken();
    const data = {firstName : user.firstName , lastName:user.lastName , username: user.username , accessToken: token}
   res.status(200).json({success:true , user:data})
};

export {sendRefreshToken, sendAccessToken}