const { eq, desc, and } = require("drizzle-orm");
const { tiersToClient, partnerToClient, validPartner } = require("./partners.utils");
const { db, partnerTiersTable, partnersTable } = require("../tables");
const { generateBlurImage } = require("ayan-pkg");


class PartnersController {
  static async createPartner(req, res) {
    try {
    
        if(!validPartner(req.body)) {
            return res.status(400).json({ message: "Name, tier and description are required", data: null });
        }

        // check if the tier exists
        const existingTier = await db.select().from(partnerTiersTable).where(
            and(
                eq(partnerTiersTable.name, req.body.tier.toLowerCase()),
                eq(partnerTiersTable.isDeleted, false)
            )
        ).limit(1);

        if(existingTier.length === 0) {
            return res.status(400).json({ message: "Invalid partner tier", data: null });
        }

        let image = req.fileUrl;

        //no image logo return error
        if(!image) {
            return res.status(400).json({ message: "Partner logo is required", data: null });
        }

        //insert without blur image first, then generate blur image and update the record
        await db.insert(partnersTable).values({
            name: req.body.name,
            logo: image,
            blur_image:image,
            tier: req.body.tier.toLowerCase(),
            description: req.body.description,
            website: req.body.website || null,
        });

        //fetch it, its the last entry
        const newPartner = await db.select().from(partnersTable).where(
            eq(partnersTable.isDeleted, false)
        ).orderBy(desc(partnersTable.created_at)).limit(1);

        if(newPartner.length === 0) {
            return res.status(500).json({ message: "An error occurred while creating partner", data: null });
        }

        //give a res then continue blur
        res.status(201).json({ message: "Partner created successfully", data: partnerToClient(newPartner)[0] });

        const blur_image = await generateBlurImage(image)

        if(blur_image) {
            //update the table, id is in newPartner[0].id
            await db.update(partnersTable).set({ blur_image }).where(eq(partnersTable.id, newPartner[0].id));
        }

        return;
 } catch (error) {
        return res.status(500).json({ message: "An error occurred while creating partner", data: null });
    }
  }

  static async getAllPartners(req, res) {
try {
    const partners = await db.select().from(partnersTable).where(eq(partnersTable.isDeleted, false)).orderBy(desc(partnersTable.created_at));

    if(partners.length === 0) {
        return res.status(200).json({ message: "No partners found", data: [] });
    }

    return res.status(200).json({ message: "Partners fetched successfully", data: partnerToClient(partners) });
} catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching partners", data: null });
}
  }

  static async updatePartner(req, res) {
    try {
        const {id} = req.params;
        if(!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Partner id is required", data: null });
        }

        if(!validPartner(req.body)) {
            return res.status(400).json({ message: "Name, tier and description are required", data: null });
        }

        const existingPartner = await db.select().from(partnersTable).where(
            and(
                eq(partnersTable.id, parseInt(id)),
            eq(partnersTable.isDeleted, false)
            )
        ).limit(1);
        // if no parner found with the id, return 404
        if(existingPartner.length === 0) {
            return res.status(404).json({ message: "Partner not found", data: null });
        }

        // check tier exists
        const existingTier = await db.select().from(partnerTiersTable).where(
            and(
                eq(partnerTiersTable.name, req.body.tier.toLowerCase()),
                eq(partnerTiersTable.isDeleted, false)
            )
        ).limit(1);

        if(existingTier.length === 0) {
            return res.status(400).json({ message: "Invalid partner tier", data: null });
        }

        const image =  req.fileUrl;

        //if no image logo, break
        if(!image) {
            return res.status(400).json({ message: "Partner logo is required", data: null });
        }

        await db.update(partnersTable).set({
            name: req.body.name,
            logo: image,
            blur_image:image,
            tier: req.body.tier.toLowerCase(),
            description: req.body.description,
            website: req.body.website || null,
        }).where(eq(partnersTable.id, parseInt(id)));

        //fetch it and return it
        const updatedPartner = await db.select().from(partnersTable).where(
            eq(partnersTable.id, parseInt(id)),
            eq(partnersTable.isDeleted, false)
        ).limit(1);

        if(updatedPartner.length === 0) {
            return res.status(500).json({ message: "An error occurred while updating partner", data: null });
        }

        // res then blur  it
       res.status(200).json({ message: "Partner updated successfully", data: partnerToClient(updatedPartner)[0] });

        const blur_image = await generateBlurImage(image)

        if(blur_image) {
            //update the table, id is in newPartner[0].id
            await db.update(partnersTable).set({ blur_image }).where(eq(partnersTable.id, parseInt(id)));
        }

        return;


    } catch (error) {
        return res.status(500).json({ message: "An error occurred while updating partner", data: null });
    }
  }

  static async deletePartner(req, res) {
    try {
        if(!req.params.id || isNaN(parseInt(req.params.id))) {
            return res.status(400).json({ message: "Partner id is required", data: null });
        }

        const existingPartner = await db.select().from(partnersTable).where(
            and(
                eq(partnersTable.id, parseInt(req.params.id)),
            eq(partnersTable.isDeleted, false)
            )
        ).limit(1);
        // if no parner found with the id, return 404
        if(existingPartner.length === 0) {
            return res.status(404).json({ message: "Partner not found", data: null });
        }

        await db.update(partnersTable).set({ isDeleted: true }).where(eq(partnersTable.id, parseInt(req.params.id)));

        return res.status(200).json({ message: "Partner deleted successfully", data: null });


    } catch (error) {
        return res.status(500).json({ message: "An error occurred while deleting partner", data: null });
    }
  }





  static async getPartnerTiers(req, res) {
    try {
      const tiers = await db
        .select()
        .from(partnerTiersTable)
        .where(eq(partnerTiersTable.isDeleted, false))
        .orderBy(desc(partnerTiersTable.created_at));

      if (tiers.length === 0) {
        return res
          .status(200)
          .json({ message: "No partner tiers found", data: [] });
      }

      return res
        .status(200)
        .json({
          message: "Partner tiers fetched successfully",
          data: tiersToClient(tiers),
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "An error occurred while fetching partner tiers",
          data: [],
        });
    }
  }

  static async createPartnerTier(req, res) {
    try {
      if (!req.body.name || req.body.name.trim() === "") {
        return res
          .status(400)
          .json({ message: "Partner tier name is required", data: null });
      }
      // check if tier with the same name already exists
      const existingTier = await db
        .select()
        .from(partnerTiersTable)
        .where(
          and(
            eq(partnerTiersTable.name, req.body.name.toLowerCase()),
            eq(partnerTiersTable.isDeleted, false),
          ),
        )
        .limit(1);
      if (existingTier.length > 0) {
        return res
          .status(400)
          .json({
            message: "Partner tier with this name already exists",
            data: null,
          });
      }

      await db
        .insert(partnerTiersTable)
        .values({ name: req.body.name.toLowerCase() });

      //fetch all tiers and retuen it, its the last entry

      const newTier = await db
        .select()
        .from(partnerTiersTable).where(eq(partnerTiersTable.isDeleted, false)).orderBy(desc(partnerTiersTable.created_at))

      if (newTier.length === 0) {
        return res
          .status(500)
          .json({
            message: "An error occurred while creating partner tier",
            data: null,
          });
      }

      return res
        .status(201)
        .json({
          message: "Partner tier created successfully",
          data: tiersToClient(newTier),
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "An error occurred while creating partner tier",
          data: null,
        });
    }
  }

  static async updatePartnerTier(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(parseInt(id))) {
        return res
          .status(400)
          .json({ message: "Partner tier id is required", data: null });
      }

      if (!req.body.name || req.body.name.trim() === "") {
        return res
          .status(400)
          .json({ message: "Partner tier name is required", data: null });
      }

      const existingTier = await db
        .select()
        .from(partnerTiersTable)
        .where(
          eq(partnerTiersTable.id, parseInt(id)),
          eq(partnerTiersTable.isDeleted, false),
        )
        .limit(1);

      if (existingTier.length === 0) {
        return res
          .status(404)
          .json({ message: "Partner tier not found", data: null });
      }

      // check if tier with the same name already exists
      const duplicateTier = await db
        .select()
        .from(partnerTiersTable)
        .where(
          eq(partnerTiersTable.name, req.body.name.toLowerCase()),
          eq(partnerTiersTable.isDeleted, false),
          eq(partnerTiersTable.id, parseInt(id)),
        )
        .limit(1);

      if (duplicateTier.length > 0) {
        return res
          .status(400)
          .json({
            message: "Partner tier with this name already exists",
            data: null,
          });
      }

      await db
        .update(partnerTiersTable)
        .set({ name: req.body.name.toLowerCase() })
        .where(eq(partnerTiersTable.id, parseInt(id)));

      //fetch all tiers and return it

      const updatedTier = await db
        .select()
        .from(partnerTiersTable).
        where(eq(partnerTiersTable.isDeleted, false)).orderBy(desc(partnerTiersTable.created_at));

      if (updatedTier.length === 0) {
        return res
          .status(500)
          .json({
            message: "An error occurred while updating partner tier",
            data: null,
          });
      }

      return res
        .status(200)
        .json({
          message: "Partner tier updated successfully",
          data: tiersToClient(updatedTier),
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "An error occurred while updating partner tier",
          data: null,
        });
    }
  }

  static async deletePartnerTier(req, res) {
    try {
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        return res
          .status(400)
          .json({ message: "Partner tier id is required", data: null });
      }

      const existingTier = await db
        .select()
        .from(partnerTiersTable)
        .where(
          eq(partnerTiersTable.id, parseInt(req.params.id)),
          eq(partnerTiersTable.isDeleted, false),
        )
        .limit(1);

      if (existingTier.length === 0) {
        return res
          .status(404)
          .json({ message: "Partner tier not found", data: null });
      }

      await db
        .update(partnerTiersTable)
        .set({ isDeleted: true })
        .where(eq(partnerTiersTable.id, parseInt(req.params.id)));

      return res
        .status(200)
        .json({ message: "Partner tier deleted successfully", data: null });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "An error occurred while deleting partner tier",
          data: null,
        });
    }
  }
}

module.exports = PartnersController;
