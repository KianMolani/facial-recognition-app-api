const express = require('express'); //required to use express framework
const bodyParser = require('body-parser'); //bodyParser used to understand contents of POST body
const bcrypt = require('bcrypt-nodejs'); //used to hash passwords and test password attempts against hash
const cors = require('cors'); //used to control cross-origin requests (more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS, https://en.wikipedia.org/wiki/Same-origin_policy)

const app = express();

app.use(bodyParser.json()); //app.use for express middleware; bodyParser.json() only parses json (more: https://medium.com/@adamzerner/how-bodyparser-works-247897a93b90)
app.use(cors());

//compared to array below, where a for loop used to sort through data, use of an actual database far more efficient
//'database' is variable that is note persistent, and initiates with just two users every time server restarts. Actual databases stores info on disks
const database = {
	users: [
		{
			id:'123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0, //number of image links sent
			joined: new Date() //creates timestamp at execution
		},
		{
			id:'124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	] //,
	/*login: [
	{
		id: '987',
		hash:'',
		email: 'john@gmail.com'
	}]*/
}

//handler for requests with different HTTP verbs at different URL paths (routes) (root ('/') in this case) (more: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)
app.get('/', (req, res)=> {
	res.send(database.users);
})

//POST request used for sign in because information sent contains password, which, for the sake of security, should be contained in the body and not as a query string (recall: GET request do not have body)
app.post('/signin', (req, res)=> {
	/*bcrypt.compare("bacon", hash, function(err, res) {

	});*/

	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) { //this line illustrates ease in accessing members of json data 
		res.json(database.users[0]); //res.json sets Content-Type header to application/json, runs object through JSON.stringify, and eventually calls res.send
		res.status(400).json('error logging in'); //setting response status
	}
})

//here, POST adds new information onto the database
app.post('/register', (req, res)=> {
	const { name, email, password } = req.body; //destructuring; recall: parses as json (see bodyParser middleware)
	
	/*bcrypt.hash(password, null, null, function(err, hash) {

	});*/

	database.users.push({ //push onto array (will be last element)
		id:'125',
		name: name,
		email: email,
		//password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length-1]);
})

//'/profile/:id' route not used for anything (yet)
app.get('/profile/:id', (req, res)=> { //:id used as placeholder for, as an example, '82192'
	const { id } = req.params;
	let found = false; //is user in our 'database'?
	database.users.forEach(user=> { //iterates through array of users
		if (user.id === id) {
			found = true;
			return res.json(user); //return statement so that we exit forEach loop and start from beginning each time
		}
	})
	if (!found) {
		res.status(400).json('user not found');
	}
})

//every time an image request is made, update the user's score (POST request, as we are changing data -- *'PUT' SHOULD BE USED INSTEAD*)
app.put('/image', (req, res)=> {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user=> {
		if (user.id === id) {
			found = true;
			user.entries++
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('not found');
	}
})

app.listen(3000, ()=> { //listen on local host on port 3001 (communication endpoint)
	console.log('app is running on port 3000');
})