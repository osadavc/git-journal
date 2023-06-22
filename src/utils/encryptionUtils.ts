import { encryption_algorithm } from "@/config";
import crypto from "crypto";

export const generateInitVector = () => {
  return crypto.randomBytes(16);
};

export const generateSecret = () => {
  return crypto.randomBytes(32);
};

export const encryptMessage = (
  message: string,
  secret: string,
  initVector: string
) => {
  const cipher = crypto.createCipheriv(
    encryption_algorithm,
    Buffer.from(secret, "hex"),
    Buffer.from(initVector, "hex")
  );

  const encryptedData =
    cipher.update(message, "utf-8", "hex") + cipher.final("hex");

  return encryptedData;
};

export const decryptMessage = (
  encryptedMessage: string,
  secret: string,
  initVector: string
) => {
  const cipher = crypto.createDecipheriv(
    encryption_algorithm,
    Buffer.from(secret, "hex"),
    Buffer.from(initVector, "hex")
  );

  const decryptedData =
    cipher.update(encryptedMessage, "hex", "utf-8") + cipher.final("utf-8");

  return decryptedData;
};
