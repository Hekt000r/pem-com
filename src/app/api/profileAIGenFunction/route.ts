import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { json } from "stream/consumers";

const ai = new GoogleGenAI({});

async function main(input: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: input,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // disable thinking
      },
      systemInstruction: `
With the users input (in albanian) output a JSON containing all the information they inputted. For example:
input: Une jam Hektor Zaimi kam lindur me 3 shkurt 1999 dhe kam studiar ne universitetin e tetoves
output:
{
"firstName": "Hektor",
"surname": "Zaimi",
"birthday": "3 shkurt 1999"
"age": <calculate age from birthday>
"description": "<create a professional looking description containing their education, past work experience. etc...>"
}
Required fields: firstname surname age birthday.
If any required fields are missing, simple put "missing"
Info: "shtul" refers to the South Eastern European University in Tetovo.
NOTE: The description must be in ALBANIAN and it must seem as if talking for himself. For example, instead of "Hektor Zaimi was born on.." it should be "Im hektor zaimi and i was born on ..."
NOTE: do NOT output ANYTHING else EXCEPT for the RAW JSON, do NOT use markdown formatting.
NOTE: if there isn't enough information to create a description, then don't create one.
NOTE: make sure the JSON is valid

`,
    },
  });
  console.log(response.text);

  return (response.text)
}

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input");

  const output = await main(input!)

  console.table(output)

  return Response.json(JSON.parse(output!))
}
