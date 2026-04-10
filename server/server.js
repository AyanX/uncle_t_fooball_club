require('dotenv').config();
const app = require("./app");

const PORT = process.env.PORT || 9000;

const {createServer} = require("http");


const server = createServer(app);

const startServer= ()=> {
  try{
    server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  }
  catch(err){
    console.error("ERROR STARTING SERVER =====>>>", err)
  }
}

startServer();