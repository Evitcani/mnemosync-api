# API Documentation
The API documentation for this project is located [here](https://party-management-api.herokuapp.com/api/v1/docs/). This remains up-to-date whenever this API project is updated.

# MnemoSync API Setup
To set this project up, you first need to pull from the shared package by getting a unique GitHub token then changing the `.npmrc` file.

## Token
To get a token from GitHub that will allow you to run this project, do the following:

1. Login to GitHub.
2. Go to the [personal access tokens page](https://github.com/settings/tokens).
3. Generate a new token.
4. Check the `repo` and `read:packages` boxes.
5. Copy the token.

## MnemoSync 
Open a terminal and navigate to where you've downloaded MnemoSync API. 

Now, type `touch .env` in the main directory. Open the `.env` file and add the following:
```
NPM_CONFIG_GITHUB_TOKEN=[YOUR GITHUB TOKEN]
```
Now you will be able to properly install all NPM dependencies.