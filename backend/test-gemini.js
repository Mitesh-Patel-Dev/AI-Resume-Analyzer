const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  try {
    const result = await model.generateContent("Say hi");
    console.log("OK:", result.response.text());
  } catch (err) {
    console.log("FULL ERROR:", err.message);
    console.log("STATUS:", err.status);
    console.log("DETAILS:", JSON.stringify(err.errorDetails || {}));
  }
}
test();
