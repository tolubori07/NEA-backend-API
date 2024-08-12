import { verify } from "jsonwebtoken"
import db from '../db';

export const protect = async (req: Request) => {
  let token;

  if (
    req.headers.get('authorization') &&
    req.headers.get('authorization').startsWith("Bearer")
  ) {
    try {
      //get token from header
      token = req.headers.get('authorization').split(" ")[1];

      //verify token
      const decoded = verify(token, process.env.JWT_SECRET);

      //Get user from the token
      if(decoded.id.startsWith("D")){
      const user = ((await db.findOne('Donors', 'ID', decoded.id)));
      return user
      }else if(decoded.id.startsWith("V")){ 
      const user = await db.findOne('Volunteer','ID',decoded.id)
        return user
      }
    } catch (error) {
      console.log(error);
      return null
    }

  }else{ 
    return null
  } 
};
