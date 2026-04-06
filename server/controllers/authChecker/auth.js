
class AuthCheck{
    static async checkAuth(req,res){
        try {
            if(req.user){
                return res.status(200).json({ message: "Authenticated", data: { email: req.user.email, username: req.user.username } });
            }else{
                return res.status(403).json({ error: "Unauthorized" });
            }
        } catch (error) {
            return res.status(403).json({ error: "Unauthorized" });
        }
    }
}

module.exports =AuthCheck