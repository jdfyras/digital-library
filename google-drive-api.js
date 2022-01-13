/* 
Google Drive API:
Demonstration to:
1. upload 
2. delete 
3. create public URL of a file.

required npm package: googleapis
*/
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = '443772158501-gl7ap33cbs8skua2mvtjru71rmi7hf7b.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04InpETQQCev0CgYIARAAGAQSNwF-L9IrhSk4a_EwZ3skRtwPoN_iWQO_FGbsvfUilx5zD7eyzROk5nBKGKbfjtqoEpGHc0iYML4'

const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
	version: 'v3',
	auth: oauth2Client,
});

/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/
const filePath = path.join(__dirname, 'a.pdf');

async function uploadFile() {
	try {
		const response = await drive.files.create({
			requestBody: {
				name: 'a.pdf', //This can be name of your choice
				mimeType: 'application/pdf',
			},
			media: {
				mimeType: 'application/pdf',
				body: fs.createReadStream(filePath),
			},
		});

		console.log(response.data);
	} catch (error) {
		console.log(error.message);
	}
}

uploadFile();

// async function deleteFile() {
// 	try {
// 		const response = await drive.files.delete({
// 			fileId: 'YOUR FILE ID',
// 		});
// 		console.log(response.data, response.status);
// 	} catch (error) {
// 		console.log(error.message);
// 	}
// }

// // deleteFile();

// async function generatePublicUrl() {
// 	try {
// 		const fileId = 'YOUR FILE ID';
// 		await drive.permissions.create({
// 			fileId: fileId,
// 			requestBody: {
// 				role: 'reader',
// 				type: 'anyone',
// 			},
// 		});

// 		/* 
// 		webViewLink: View the file in browser
// 		webContentLink: Direct download link 
// 		*/
// 		const result = await drive.files.get({
// 			fileId: fileId,
// 			fields: 'webViewLink, webContentLink',
// 		});
// 		console.log(result.data);
// 	} catch (error) {
// 		console.log(error.message);
// 	}
// }

// generatePublicUrl();
