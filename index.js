const { firefox } = require('playwright')
const { uuid4: uuid } = require('uuid')
const fs = require('fs/promises')

class GoogleReset {
	async spawn() {
		this.browser = await firefox.launch({ headless: false });
		this.page = await this.browser.newPage();
	}

	/**
	 * 
	 * @param {String} password 
	 * @description Fills out the password field in the page and navigates
	 */
	async fillPasswordField(password) {
		const page = this.page
		await page.waitForSelector("//*[@id=\"password\"]/div[1]/div/div[1]/input")
		await page.fill("//*[@id=\"password\"]/div[1]/div/div[1]/input", password)
	
		await page.waitForSelector("//*[@id=\"passwordNext\"]/div/button")
		await page.click("//*[@id=\"passwordNext\"]/div/button")

		await page.waitForNavigation()
	}
	
	async login(email, password) {
		const page = this.page;

		await page.goto("https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=email&access_type=offline&flowName=GeneralOAuthFlow")
	
		await page.fill("input[type='email']", email)
		await page.click("//*[@id=\"identifierNext\"]/div/button")

		await this.fillPasswordField(password)
	}

	async changePassword(oldPassword) {
		const page = this.page;

		// Goes through google security check first, then resets password
		await page.goto("https://myaccount.google.com/signinoptions/password?continue=https%3A%2F%2Fmyaccount.google.com%2Fsecurity%3Fpli%3D1")
		await page.waitForNavigation()

		await this.fillPasswordField(oldPassword)

		// Create new password
		const newPw = uuid()

		await page.fill("//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[1]/c-wiz/form/div[1]/div/div[1]/div/div[1]/input", 
			oldPassword)

		// Fills new password fields, then click the change pw button
		await page.fill("//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[1]/c-wiz/form/div[1]/div/div[1]/div/div[1]/input", 
			newPw)
		await page.fill("//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[1]/c-wiz/form/div[3]/div/div[1]/div/div[1]/input",
			newPw)
		
		await page.click("//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[2]/div/span/span")
	}

	async changeRecoveryEmail(password, recoveryEmail) {
		const page = this.page;

		await page.goto("https://myaccount.google.com/recovery/email")
		await page.waitForNavigation()

		await this.fillPasswordField(password)

		// Clicks the two buttons
		try {
			await page.click("//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[1]/div/div")
		} catch (err) {
			await page.click("//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[1]/div/div[2]")
		}

		// inputs recovery email and clicks done
		await page.waitForSelector("//*[@id=\"yDmH0d\"]/div[11]/div/div[2]/span/div/div[1]/div[1]/div/div[1]/input")
		await page.fill("//*[@id=\"yDmH0d\"]/div[11]/div/div[2]/span/div/div[1]/div[1]/div/div[1]/input",
			recoveryEmail)

		await page.click("//*[@id=\"yDmH0d\"]/div[11]/div/div[2]/div[3]/div[2]")
	}

	async done() {
		await this.browser.close()
	}
}

/**
 * @param {String} fileName of the file containing accounts
 * @returns Array List of account objects, with email and password attribute
 */
const getAccounts = async (fileName) => {
	const f = await fs.readFile(fileName)
	const lines = f.split("\n")
	return lines.map(account => {
		const a = account.split(":")
		return {
			email: a[0],
			password: a[1],
		}
	})
}

(async () => {
	const recov = "evemarcuschris479@gmail.com"
	// const inst = new GoogleReset()
	// await inst.spawn()
	// await inst.login(email, password)
	// await inst.changeRecoveryEmail(password, recov)

	console.log(getAccounts("gmails.csv"));
})()