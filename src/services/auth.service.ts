import { client } from "../config/prismaClient";

interface userRequest extends Request {
  userId?: string;
}

export const findExistingUser = async (email: string, username: string) => {
  return await client.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
};
export const createNewUser = async (userData: {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  phonenumber: string;
}) => {
  return await client.user.create({
    data: userData,
  });
};

export const findLoginUser = async (identifier:string)=>{
    return await client.user.findFirst({
        where:{
            OR:[{email:identifier},{username:identifier}]
        }
    })
}