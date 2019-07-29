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
  json.date = (new Date()).toLocaleDateString()
  response.type('json').send(json);
  console.log('The JSON: ', json)
})

app.post('/scores', 
express.json(),
(req, res) => {
  console.log('POST received, body is: ', req.body);
  const theFile = $path.join(dataPath, 'scores.json');
  fs.writeFileSync(theFile, JSON.stringify(req.body));
  res.status(201).send('Success');
})
  
app.listen(port, () => console.log(`Listening on port ${port}!`));