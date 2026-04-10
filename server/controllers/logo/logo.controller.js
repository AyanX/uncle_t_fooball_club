const { desc, eq } = require("drizzle-orm");
const {generateBlurImage}= require("ayan-pkg")
const {db,logoTable} = require("../tables")

class LogoController {
    static async getLogo(req, res) {
        try {
            const logo = await db.select().from(logoTable).orderBy( desc(logoTable.created_at) ).limit(1);
            return res.status(200).json({ message: "Logo fetched successfully.", data: logo[0] });
        } catch (error) {
            return res.status(500).json({ message: "An error occurred while fetching the logo.", data:null });
        }
    }
    static async createLogo(req, res) {
        try {
            console.log("Creating logo with file:", req.fileUrl);
            const image = req.fileUrl
            if (!image) {
                return res.status(400).json({ message: "Image is required.", data:null });
            }

            //insert the logo into the database
            await db.insert(logoTable).values({
                image,
                blur_image: image, 
            })

            //return res and blur the logo

            res.status(201).json({ message: "Logo created successfully.", data: { image, blur_image: image } });

            const blur = generateBlurImage(image);

            if(blur){
                await db.update(logoTable).set({ blur_image: blur }).where(eq(logoTable.image, image));
            }
            return


        } catch (error) {
            console.error("Error creating logo:", error);
            return res.status(500).json({ message: "An error occurred while creating the logo.", data:null });
        }
    }
}

module.exports = LogoController;