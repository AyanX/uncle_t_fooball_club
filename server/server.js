require("dotenv/config");
const app = require("./app");

const PORT = process.env.PORT || 9000;

const {createServer} = require("http");


const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});