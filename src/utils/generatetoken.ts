import { sign } from "jsonwebtoken";

export const generateToken = (id: any) => {
  return sign({ id }, process.env.JWT_SECRET);
};
