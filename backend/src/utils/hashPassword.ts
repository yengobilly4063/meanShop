import bycrypt from "bcryptjs"

export const hashPassword = async (passwordToHash: string):Promise<string> => {
  return await bycrypt.hash(passwordToHash, 10)
}

export const comparePassword = async (enteredPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bycrypt.compare(enteredPassword, hashedPassword);
}