
const yaml = require('js-yaml');
const fs = require('fs');
//const INPUT_FILE='test/email.yml';
const INPUT_FILE='stuff/email.yml';

let config = {};

// Our mock function that would do the heavy lifting of sending the email message.
// The mailOptions object is designed to be compatible with Nodemailer
function sendEmail(transport, mailOptions) {
	console.log(mailOptions);
}

// Shape the recipients into an array
function getRecipients(recipients) {
	const to = [];
	for (const email in recipients) {
		const name = recipients[email];
		const address = name ? `${name} <${email}>` : email;
		to.push(address);
	}
	return to;
}

function sendMessageCore(message, subject, body) {
	const mailOptions = {
		from: message.from,
		to: getRecipients(message.recipients),
		subject,
		html: body,
	};
	sendEmail(config.transport, mailOptions);
}

function sendMessageToManagement(subject, body) {
	const message = config.management_message;
	sendMessageCore(message, subject, body);
}

function sendMessageToOperations(subject, body) {
	const message = config.operations_message;
	sendMessageCore(message, subject, body);
}

function sendMessageToAllEmployees(subject, body) {
	const message = config.all_employees_message;
	sendMessageCore(message, subject, body);
}


try {
	//config = yaml.safeLoad(fs.readFileSync('email.yml', 'utf8'));
	if (fs.existsSync(INPUT_FILE)){
		config = yaml.load(fs.readFileSync(INPUT_FILE, 'utf8'));
		sendMessageToManagement('Management Update', 'Here is the body of the message');
		sendMessageToOperations('Operations Update', 'Here is the body of the message');
		sendMessageToAllEmployees('All Employees Update', 'Here is the body of the message');
	}
	else
		console.warn(`non-existent: ${INPUT_FILE}`);
} catch (e) {
	console.log(e);
}
