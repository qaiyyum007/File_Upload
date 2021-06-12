import jwt from "jsonwebtoken"

  export const isAuth = (req, res, next) => {
   try {
    const token=req.headers.token
  
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).send({ message: 'Invalid Token' });
        }
        req.user = user;
        next();
        return;
      });
    } else {
      return res.status(401).send({ message: 'Token is not supplied.' });
    } 
   } catch (err) {
    return res.status(500).send(`${err.message}-${err.stack}`)

   }
    
  };





  
