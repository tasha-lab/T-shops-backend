import { client } from "../config/prismaClient";

export const approve = async (id: string) => {
  const vendorExists = await client.vendor.findFirst({
    where: { id },
  });
  if (!vendorExists) throw new Error("VendorNotFound");
  return await client.vendor.update({
    where: { id },
    data: { status: "Active" },
  });
};
export const getUnapprovedVendor = async () => {
  const vendors = await client.vendor.findMany({
    where: { status: "Pending" },
  });
  return vendors;
};
export const getSuspendedVendor = async () => {
  const vendors = await client.vendor.findMany({
    where: { status: "Suspended" },
  });
  return vendors;
};
export const suspend = async (id: string) => {
  const vendorExists = await client.vendor.findFirst({
    where: { id },
  });
  if (!vendorExists) throw new Error("VendorNotFound");
  return await client.vendor.update({
    where: { id },
    data: { status: "Suspended" },
  });
};
