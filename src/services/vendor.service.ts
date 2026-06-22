import { client } from "../config/prismaClient";

export const createVendorService = async (
  userId: string,
  shopname: string,
  shopdescription: string,
  mpesaNumber: string,
  bankName: string,
  bankAccount: string
) => {
  const vendor = await client.vendor.create({
    data: {
      userId,  
      shopname,
      shopdescription,
      mpesaNumber,
      bankName,
      bankAccount,
    },
  });
  return vendor;
};
