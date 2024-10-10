import { Router, Request, Response } from "express";
import { client } from "../stream-client";
import { UserRequest } from "@stream-io/node-sdk";


const router = Router();

router.post(
  "/createUser",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, name, image } = req.body;

      if (!username || !name || !image) {
        res.status(400).json({ error: "Required fields were empty" });
        return;
      }

      const newUser: UserRequest = {
        id: username,
        role: "user",
        name,
        image,
      };

      await client.upsertUsers([newUser]);

      const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

      const token = client.generateUserToken({
        user_id: username,
        validity_in_seconds: expiry,
      });

      res.status(200).json({ token, username, name });
      return;
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          ` an error occured at createUSer Controller ${error.message}`
        );
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
