//write express code 

const express = require("express");
const app = express();
const $path = require('path');
const fs = require('fs');
const port = process.env.PORT || 5000;
const dataPath = $path.resolve('./data')

// app.use(express.static('build'));

app.get('/scores', (request, response) => {
  const theFile = $path.join(dataPath, "scores.json");
  console.log(theFile);
  const buffer =  fs.readFileSync(theFile);
  const json = JSON.parse(buffer);
  response.type('json').send(json);
  console.log('The JSON: ', json)
})

app.post('/scores', 
express.json(),
(req, res) => {
  const theFile = $path.join(dataPath, 'scores.json');
  const oldFile = fs.readFileSync(theFile);
  const jsonData = JSON.parse(oldFile); 
  jsonData.highScores.push(req.body);
  fs.writeFileSync(theFile, JSON.stringify(jsonData));
  res.status(201).send('Success');
})
  
app.listen(port, () => console.log(`Listening on port ${port}!`));