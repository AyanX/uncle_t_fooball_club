const { desc } = require("drizzle-orm");
const {db,socialsTable} = require("../tables");
const { validSocialToClient, validSocial } = require("./social.utils");

class SocialsController{
    static async getSocials(req, res){
        try{
           
            const socials = await db.select().from(socialsTable).orderBy(desc(socialsTable.created_at)).limit(1);
            if(!socials || socials.length === 0){
                return res.status(200).json({message: "No socials found", data:null});
            }
            return res.status(200).json({message: "Socials fetched successfully", data:validSocialToClient(socials[0])});
        }
        catch(err){
            return res.status(500).json({message: "Error fetching socials", data:null});
        }
    }


    static async updateSocials(req, res){
        try {
             console.log("fetching socials")
            if(!validSocial(req.body)){
                return res.status(400).json({message: "Invalid socials data", data:null});
            }

            // insert it like a new entry
            await db.insert(socialsTable).values(validSocialToClient(req.body));

            return res.status(200).json({message: "Socials updated successfully", data:  validSocialToClient(req.body)});

        } catch (error) {
            return res.status(500).json({message: "Error updating socials" , data:null});
        }
    }
}

module.exports = SocialsController;