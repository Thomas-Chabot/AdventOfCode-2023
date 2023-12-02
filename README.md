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

## Applying the Session Token
1. Start the program by running `npm start`.
2. Enter `configure` to enter configuration mode.
3. Paste your Session Token.