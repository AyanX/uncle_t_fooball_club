const { eq, desc } = require("drizzle-orm");
const {db, managementTable} = require("../../tables");
const { validManagementToClient, validManagement, singleManagementToClient } = require("../club.utils");

const {generateBlurImage} = require("ayan-pkg")

class ManagementController{
    static async getManagement(req, res) {
        try {
            const management =await db.select().from(managementTable).where(eq(managementTable.isDeleted, false)).orderBy(desc(managementTable.created_at))
            if(!management) return res.status(200).json({ message: "No management data found", data:[] });
     
            return res.status(200).json({ message: "Management data fetched successfully", data: validManagementToClient(management) });
     
        } catch (error) {
            console.error("Error fetching management data:", error);
            return res.status(500).json({ message: "Error fetching management data", data:[] });
        }
    }


    static async updateManagement(req, res) {
        try {
             if(!validManagement(req.body)) return res.status(400).json({ message: "Invalid management data", data:[] });

            const image = req.fileUrl || req.body.image
            if(!image) return res.status(400).json({ message: "Management image is required", data:[] });
            
            const newManagement = {
                name: req.body.name,
                role: req.body.role,
                image,
                blur_image: image
            }


            // confirm it exists
            const management = await db.select().from(managementTable).where(eq(managementTable.id, req.params.id)).limit(1);
            if(!management || management.length === 0) return res.status(404).json({ message: "Management data not found", data:[] });

            // update the record
            await db.update(managementTable).set(newManagement).where(eq(managementTable.id, req.params.id));
            // res with req.body

            res.status(200).json({ message: "Management data updated successfully", data: singleManagementToClient({ id: req.params.id, ...newManagement }) });

            //generate blur
            const blur = generateBlurImage(image)

            // update the record with the blur
            if(blur) await db.update(managementTable).set({ blur_image: blur }).where(eq(managementTable.id, req.params.id));
            return

        } catch (error) {
            return res.status(500).json({ message: "Error updating management data" , data:[]});
        }
    }

    static async deleteManagement(req, res) {
        try {
            if(!req.params.id) return res.status(400).json({ message: "Management id is required", data:[] });
            //confirm it exists

            const management = await db.select().from(managementTable).where(eq(managementTable.id, req.params.id)).limit(1);

            if(!management) return res.status(404).json({ message: "Management data not found", data:[] });

            //soft del
            await db.update(managementTable).set({ isDeleted: true }).where(eq(managementTable.id, req.params.id));

            return res.status(200).json({ message: "Management data deleted successfully", data:[] });

        } catch (error) {
            return res.status(500).json({ message: "Error deleting management data" , data:[]});
        }
    }

    static async createManagement(req, res) {
        try {
            if(!validManagement(req.body)) return res.status(400).json({ message: "Invalid management data", data:[] });

            const image = req.fileUrl
            if(!image) return res.status(400).json({ message: "Management image is required", data:[] });
            
            const newManagement = {
                name: req.body.name,
                role: req.body.role,
                image,
                blur_image: image
            }

            // insert into db
            await db.insert(managementTable).values(newManagement)

            //  fetch it, last entry

            const insertedManagement = await db.select().from(managementTable).where(eq(managementTable.isDeleted, false)).orderBy(desc(managementTable.created_at)).limit(1)

         res.status(201).json({ message: "Management data created successfully", data: singleManagementToClient(insertedManagement[0]) });

            // generate a blur

            const blur = generateBlurImage(image)

            if(!blur) return
            // update the record with the blur
            await db.update(managementTable).set({ blur_image: blur }).where(eq(managementTable.id, insertedManagement[0].id)); 

        } catch (error) {
            return res.status(500).json({ message: "Error creating management data" , data:[]});
        }
    }
}

module.exports = ManagementController