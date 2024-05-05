const express = require("express");
require("dotenv").config();
const { OpenAI } = require("openai");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const messagesArray = [{"role": "user", "content": "Limítate a contestar únicamente con el menor número de líneas de código JavaScript, sin inventarte nada (ni datos ni variables que no existen en el código). Te voy a enviar tres cosas:1. El html de la página actual. 2. Los datos que hay que rellenar en dicha página. 3. Lo que el usuario quiere rellenar en ese momento. Si el usuario no te da toda la información, no te la inventes."}];
  try {
    messagesArray.push({"role": "user", "content": req.body.message});

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesArray,
      temperature: 0,
      max_tokens: 150
    });
    
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.response
        ? error.response.data
        : "There was an issue on the server",
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));