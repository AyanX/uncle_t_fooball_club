const { desc } = require("drizzle-orm");
const {db,adminLoginDetails,adminProfileTable} = require("../tables");
const {hashPassword, comparePasswords} = require("../../utils/bcrypt");
const { generateToken, generateRefreshToken } = require("../../utils/jwt");
class AdminController{

    static async getProfile(req,res){
        try{
            const profile = await db.select().from(adminProfileTable).orderBy(desc(adminProfileTable.created_at)).limit(1);

            if(profile.length === 0){
                return res.status(404).json({message: "Admin profile not found", data:null});
            }

            return res.status(200).json({message: "Admin profile fetched successfully", data: {email: profile[0].email, username: profile[0].username}});
        }
        catch(error){
            console.error("Error fetching admin profile:", error);
            return res.status(500).json({message: "An error occurred while fetching admin profile", data:null});
        }
    }
    static async updateUsername(req,res){
        try {
            if(!req.body.username){
                return res.status(400).json({message: "Username is required", data:null});
            }

            const existingProfile = await db.select().from(adminProfileTable).orderBy(desc(adminProfileTable.created_at)).limit(1);

            //get name and email from existing profile
            const email = existingProfile[0]?.email || "";

            const newProfile = {
                email,
                username: req.body.username
            }


            //insert to profiletable

            await db.insert(adminProfileTable).values(newProfile);

            return res.status(200).json({message: "Username updated successfully", data:{username: req.body.username}});

        } catch (error) {
            console.error("Error updating username:", error);
            return res.status(500).json({message: "An error occurred while updating username", data:null});
        }
    }

     static async updateEmail(req,res){
        try {
                     if(!req.body.email){
                return res.status(400).json({message: "Email is required", data:null});
            }

            const existingProfile = await db.select().from(adminProfileTable).orderBy(desc(adminProfileTable.created_at)).limit(1);

            //get name and email from existing profile
            const username = existingProfile[0]?.username || "";

            const newProfile = {
                email: req.body.email,
                username
            }


            //insert to profiletable

            await db.insert(adminProfileTable).values(newProfile);

            return res.status(200).json({message: "Email updated successfully", data:{email: req.body.email}});

        } catch (error) {
            console.error("Error updating email:", error);
            return res.status(500).json({message: "An error occurred while updating email", data:null});
        }
     }

    static async updatePassword(req,res){
        try {
            //{"current_password": "admin123", "new_password": "admin123"
 
            if(!req.body.current_password || !req.body.new_password){
                return res.status(400).json({message: "Current password and new password are required", data:null});
            }
            const storedPasswordData = await db.select().from(adminLoginDetails).orderBy(desc(adminLoginDetails.created_at)).limit(1);

            if(storedPasswordData.length === 0){
                return res.status(404).json({message: "Admin login details not found", data:null});
            }

            const storedHashedPassword = storedPasswordData[0].password;

            const isCurrentPasswordValid = await comparePasswords(req.body.current_password, storedHashedPassword);

            if(!isCurrentPasswordValid){
                return res.status(401).json({message: "Current password is incorrect", data:null});
            }

            const newHashedPassword = await hashPassword(req.body.new_password);

            await db.insert(adminLoginDetails).values({password: newHashedPassword, pin : storedPasswordData[0].pin});
            return res.status(200).json({message: "Password updated successfully", data:null});
        } catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({message: "An error occurred while updating password", data:null});
        }
    }

    static async updatePin(req,res){
    // "pin": "1234",
    // "confirm_pin": "1234"
    try {

        if(!req.body.pin || !req.body.confirm_pin){
            return res.status(400).json({message: "PIN and confirm PIN are required", data:null});
        }

        if(req.body.pin !== req.body.confirm_pin){
            return res.status(400).json({message: "PIN and confirm PIN do not match", data:null});
        }

      //hash and store it
      const hashedPin =await hashPassword(req.body.pin);
    const storedPasswordData = await db.select().from(adminLoginDetails).orderBy(desc(adminLoginDetails.created_at)).limit(1);

            if(storedPasswordData.length === 0){
                return res.status(404).json({message: "Admin login details not found", data:null});
            }

    const storedHashedPassword = storedPasswordData[0].password;


    //store the hashedPassword and pin

    await db.insert(adminLoginDetails).values({password: storedHashedPassword, pin: hashedPin});

    return res.status(200).json({message: "PIN updated successfully", data:null});


    } catch (error) {
        console.error("Error updating PIN:", error);
        return res.status(500).json({message: "An error occurred while updating PIN", data:null});
    }

    }


      static async login(req, res) {
         try {
      if (!req.body.email || !req.body.password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const email = await db
        .select()
        .from(adminProfileTable)
        .orderBy(desc(adminProfileTable.created_at))
        .limit(1);

      if (email.length < 1) {
        return res.status(404).json({ message: "Admin email not found" });
      }

      const password = await db
        .select()
        .from(adminLoginDetails)
        .orderBy(desc(adminLoginDetails.created_at))
        .limit(1);

      if (password.length < 1) {
        return res.status(404).json({ message: "Admin password not found" });
      }

      // check emails match
      if (email[0].email !== req.body.email) {
        return res.status(401).json({ error: "Incorrect Login credentials" });
      }
      //check password using bcrypt

      const isPasswordValid = await comparePasswords(
        req.body.password,
        password[0].password,
      );

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Incorrect Login credentials" });
      }
      // cookies implementaation

      const token = generateToken({
        email: email[0].email,
        username: email[0].username,
      });

      const refreshToken = generateRefreshToken({
        email: email[0].email,
        username: email[0].username,
      });


      res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          path: "/",
          maxAge: 1000 * 60 * 10, // 10 minutes
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

      return res.json({ message: "Login successful", data:{email: email[0].email, username: email[0].username} });
  
  
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Error during login" });
    }
  }


static async loginWithPin(req, res) {
  try {
     const {email,pin}= req.body;

     if(!email || !pin){
        return res.status(400).json({message: "Email and PIN are required"});
     }

     const emailData = await db.select().from(adminProfileTable).orderBy(desc(adminProfileTable.created_at)).limit(1);

     if(emailData.length === 0){
        return res.status(404).json({message: "Admin email not found"});
     }

     const pinData = await db.select().from(adminLoginDetails).orderBy(desc(adminLoginDetails.created_at)).limit(1);

     if(pinData.length === 0){
        return res.status(404).json({message: "Admin PIN not found"});
     }

     if(emailData[0].email !== email){
        return res.status(401).json({message: "Incorrect Login credentials"});
     }

     const isPinValid = await comparePasswords(pin, pinData[0].pin);

     if(!isPinValid){
        return res.status(401).json({message: "Incorrect Login credentials"});
     }


           // cookies implementaation

      const token = generateToken({
        email: emailData[0].email,
        username: emailData[0].username,
      });

      const refreshToken = generateRefreshToken({
        email: emailData[0].email,
        username: emailData[0].username,
      });


      res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          path: "/",
          maxAge: 1000 * 60 * 10, // 10 minutes
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

      return res.json({ message: "Login successful", data:{email: emailData[0].email, username: emailData[0].username} });
  

     //generate token and refresh token
  } catch (error) {
    return res.status(500).json({ message: "Error during PIN login" });
  }
}

  static async logout(req, res) {
     try {
      // clear the token cookie and refreshToken
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      }).clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      return res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({ message: "Error during logout" });
    }
  }

}
module.exports = AdminController;