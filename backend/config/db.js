const mongoose = require("mongoose");
const dns = require("dns");

// Force Google DNS for SRV resolution (fixes network blocking issues)
dns.setDefaultResultOrder("ipv4first");
const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "8.8.4.4"]);

// Override the default DNS resolve functions to use Google DNS
const origResolveSrv = dns.resolveSrv;
dns.resolveSrv = function (hostname, callback) {
  resolver.resolveSrv(hostname, callback);
};
const origResolveTxt = dns.resolveTxt;
dns.resolveTxt = function (hostname, callback) {
  resolver.resolveTxt(hostname, callback);
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log("💡 Retrying in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
