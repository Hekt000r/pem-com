/*************
 * utils/UserFromOID.ts
 * Gets a user from MongoDB database using an Oauth ID
 */

import { Collection } from "mongodb";
import { connectToDatabase } from "./mongodb";


export async function UserFromOID(oid: string) {
    const {db} = await connectToDatabase("Users")
    const col: Collection = db.collection("Endusers")

    const user = await col.findOne({oauthId: oid})

    return user
}