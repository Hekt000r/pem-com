# Documentation for Google Gemini AI functions

## Current prompt used for finishprofile

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
NOTE: The description must be in ALBANIAN and it must seem as if talking for himself. For example, instead of "Hektor Zaimi was born on.." it should be "Im hektor zaimi and i was born on ..."
NOTE: do NOT output ANYTHING else EXCEPT for the RAW JSON, do NOT use markdown formatting.
NOTE: if there isn't enough information to create a description, then don't create one. (if any values are missing dont create a description)
NOTE: make sure the JSON is valid