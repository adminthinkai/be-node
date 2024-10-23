const { AzureOpenAI } = require("openai");

// Load the .env file if it exists
const dotenv = require("dotenv");
dotenv.config();

// You will need to set these environment variables or edit the following values
const endpoint = "https://thinkai-test.openai.azure.com/";
const apiKey = "9627fc3c46eb4a689fa17b5cf4fd996a";
const apiVersion = "2024-05-01-preview";
const deployment = "test"; //This must match your deployment name.
require("dotenv/config");

async function main() {
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
  const result = await client.chat.completions.create({
    messages: [{ role: "user", content: "2+2 = ?" }],
    model: "",
  });

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };
