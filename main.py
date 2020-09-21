from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, ElementNotInteractableException
from uuid import uuid4
import logging
import time

class Tool:
	def __init__(self):
		self.driver = webdriver.Chrome("/home/yungflex/Downloads/chromedriver_linux64/chromedriver") # Customize with your path to chrome webdriver

	def login(self, email, password):
		self.driver.get("https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=email&access_type=offline&flowName=GeneralOAuthFlow")
		email_field = self.driver.find_element_by_css_selector("input[type='email']")

		for i in range(len(email)):
			email_field.send_keys(email[i])
			time.sleep(.1)

		next_btn = self.driver.find_element_by_xpath("//*[@id=\"identifierNext\"]/div/button")
		next_btn.click()

		time.sleep(.5)
		try:
			password_field = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"password\"]/div[1]/div/div[1]/input")))
		except ElementNotInteractableException:
			password_field = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"password\"]/div[1]/div/div[1]/input")))
		
		for i in range(len(password)):
			password_field.send_keys(password[i])
			time.sleep(.1)

		login_btn = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"passwordNext\"]/div/button")))
		login_btn.click()

	def change_password(self, old_password):
		self.driver.get("https://myaccount.google.com/security")

		change_pw_btn = self.driver.find_element_by_xpath("//*[@id=\"yDmH0d\"]/c-wiz/div/div[2]/c-wiz/c-wiz/div/div[3]/div/div/c-wiz/section/div[2]/article/div/div/div[2]/div/a")
		change_pw_btn.click()

		pw_field = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"password\"]/div[1]/div/div[1]/input")))
		for i in range(len(old_password)):
			pw_field.send_keys(old_password[i])
			time.sleep(.1)

		next_btn = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"passwordNext\"]/div/button")))
		next_btn.click()

		uuid = uuid4()
		new_pw = uuid.__str__()

		new_pw_field_0 = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[1]/c-wiz/form/div[1]/div/div[1]/div/div[1]/input")))
		for i in range(len(new_pw)):
			new_pw_field_0.send_keys(new_pw[i])
			time.sleep(.1)

		new_pw_field_1 = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[1]/c-wiz/form/div[3]/div/div[1]/div/div[1]/input")))
		for i in range(len(new_pw)):
			new_pw_field_1.send_keys(new_pw[i])
			time.sleep(.1)
		
		print(f"The new password is {new_pw}")

		change_pwd_btn = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[@id=\"yDmH0d\"]/c-wiz/div/div[3]/c-wiz/div/div[3]/div[2]/div/span/span")))
		change_pwd_btn.click()

	def done(self):
		self.driver.close()

if __name__ == "__main__":
	i = Tool()
	i.login("Johnathanlopez197@gmail.com", "21savageyerrr")
	time.sleep(3)
	i.change_password("21savageyerrr")
