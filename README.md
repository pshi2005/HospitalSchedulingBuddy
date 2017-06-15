# Duke2016 Chatbot README.md

This is a Facebook Messenger chatbot built for HackNC 2016. Check out our DevPost at https://devpost.com/software/healthschedulingbuddy/.

Special thanks to Kameron Kales of Glance Technology (https://github.com/KameronKales/) for providing the slackbot tutorial and giving us feedback. You can find his Facebook Slackbot tutorial here: https://github.com/KameronKales/Duke2016-by-Glance.

FB Messenger Chatbot Activation Steps

	1. Go to Developers.facebook.com. 
	2. Login using your Facebook username and password.
	3. Go to "My Apps" in the Top Right Corner.
	4. Click on "Add a New App."
	5. Under display name, name the app "DSSS Demo" or another name. Leave the contact email or change if necessary.
	6. Click "Create App ID."
	7. Pass the Security Check.
	8. Under the Messenger product, click "Set Up."
	9. Under Page, select the page that you are using. In our case, we are using the page "Hospital Scheduling Buddy." If no page is available, create a new Facebook page first.
	10. Copy the resulting Page Access Token to your clipboard.
	11. Click Setup Webhooks.
	12. Leave the Callback URL blank for now.
	13. Create a Verify Token of your choice. We will use "Cisco EDSO demo" as our Verify Token. 
	14. In facebook_bot.js in the HospitalSchedulingBuddy repository,  change the variable verify_token to be "Cisco EDSO demo" or your own verify token.
	15. Check all Subscription fields related to messages. This should be all of them.
	16. Open a new terminal.
	17. Navigate to a folder of your choice where you would like to store this project.
	18. Run the following command in your terminal: git clone https://github.com/pshi2005/HospitalSchedulingBuddy.git
	19. CD into the HospitalSchedulingBuddy file.
	20. Open a new tab in the terminal. Run the following command to start up the http server: python -m http.server 7000
	21. Open a new tab in the terminal. Run the following command in your terminal: ngrok http 7000
	22. Copy the ngrok url. 
	23. Go back to your Facebook Developers screen and paste the ngrok url in the Facebook Callback URL box for Setting up Webhooks. Change the "http" to "https" and add "/facebook/receive" at the end of the Callback URL.
	24. Open a new tab in the terminal. Run the following command to start up the node.js server: nodemon facebook_bot.js
	25. Under the Webhooks section in the Messenger Platform on the Facebook Developer page, select the page that you would like to use. Click "Subscribe" to link your ngrok, http, and node.js servers to the selected page.
	26. Under the App Review for Messenger section in the Messenger Platform on the Facebook Developer page, click "Add to Submission" for pages_messaging, pages_messaging_subscriptions, and pages_messaging_phone_number. 
	27. Your program should now be up and running! After publishing your Facebook web page, go to Facebook messenger. Search for the name of your page and start chatting away!
