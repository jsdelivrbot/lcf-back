var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(cors()); // https://www.npmjs.com/package/cors
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var moment = require('moment');
var StellarSdk = require('stellar-sdk');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  console.log("BEGIN");
  for (let row of res.rows) {
    console.log("ROW");
    console.log(JSON.stringify(row));
  }
  console.log("END");
  client.end();
});

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
  response.send('Hello World!')
})

app.get('/send/create', function (request, response) {
  response.send('Creating a Send.')
})



// http://theusualstuff.com/handle-form-data-express-get-post-method/
//route the GET request to the specified path, "/user". 
//This sends the user information to the path  
app.post('/send/create', function (req, res) {
  // console.log(req);
  if (!req.body.Destination || !req.body.TokenName || !req.body.Amount) {
    res.end("ERROR: A required data field is missing. Ensure provide Destination, TokenName, and Amount data fields.");
  }

  // Step 1: Ensure public address/key is valid.
  if (StellarSdk.StrKey.isValidEd25519PublicKey(address)) {
    // address isValidEd25519PublicKey
    localStorage.setItem('lastEnteredAddress', address);
    // console.log("corr")
    let server = new StellarSdk.Server('https://horizon.stellar.org');
    server.accounts()
      .accountId(address)
      .call().then((r) => {
        console.log(r);

        let result = JSON.parse(JSON.stringify(r)); // April 4 2018 deleted logs to finaggle this

        // Step 2:  Ensure account has at least 4.5 XLM to cover base fee.s
        if (result.balances[result.balances.length - 1].balance >= 4.5) {
          // alert("Account has more than 4.5");

        } else {
          // alert("Account has less than 4.5");
        }

        // Step 3: Ensure account can accept asset. 
        let canAcceptToken = false;
        result.balances.forEach((b) => {
          if (b.asset_code) {
            // console.log("typeof b.asset_code", typeof b.asset_code);
            console.log("compare balances accepted vs. tab's token", this.props.selectedToken.toUpperCase(), b.asset_code.toUpperCase());
            if (this.props.selectedToken.toUpperCase() === b.asset_code.toUpperCase()) {
              canAcceptToken = true;
              // There's no built-in ability to break in forEach. https://stackoverflow.com/a/2641374
            }
          }
        });
        console.log(canAcceptToken);
        if (canAcceptToken) {
          // Account can accept token.
        } else {
          // Account can't accept token.
        }

      });
  } else { // if query entered into field isn't a valid public key
    console.log("query entered into field isn't a valid public key");
    // this.setState({ addressIsValid: false, hasEnoughXlm: false, canAcceptToken: false });
  }

  response = {
    TokenName: req.body.TokenName,
    Amount: req.body.Amount,
    Destination: req.body.Destination,
    SendStart: req.body.SendStart
  };
  console.log(response);

  //convert the response in JSON format
  res.end(JSON.stringify(response));
});





app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
