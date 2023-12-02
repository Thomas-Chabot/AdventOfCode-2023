# Advent of Code 2023
This repo contains solutions for the [Advent of Code for 2023](https://adventofcode.com/2023).

# Configuring the Environment
This project will automatically retrieve your input data from the Advent of Code servers using your session cookie. Please follow the steps below to set this up.

## Fetching Session Token
1. Navigate to [Advent of Code](https://adventofcode.com/2023).
2. Log in with whatever user you'd like to use.
3. Open up your Dev Tools, and inspect your cookies (In Chrome, you can find this at Application > Cookies).
4. Under `Cookies`, open the cookies for https://adventofcode.com.
5. Copy the value of the `session` cookie.

## Saving the Environment Variable
1. Create a new file under the `build` folder with the name `.env`.
2. In this new .env file, paste the following, replacing {{YOUR SESSION COOKIE}} with the value retrieved above:
```
SESSION={{YOUR SESSION COOKIE}}
```
3. Save the file.