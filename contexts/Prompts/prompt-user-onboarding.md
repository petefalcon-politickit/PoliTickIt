# User Onboarding

- using the image a guide let's create a user onboarding workflow.
- There are new logo svg in the assest image
- The onboarding workflow should follow these steps
  1.  Sign in or create an account
      - should have a forgot process
      - email and password need to login
      - after successful login Accoutavility is the landing page
  2.  Sign up, will have a few steps in the workflow
      a. Capture the users firstname, lastname, email address, confirm email, password and confirm password
      b. Ask for the zip code so that Politickit can determine the user district and representatives. Zip code is required to move to the next step.
      c. Ask the user for interested policy areas, it is ok to not select any. User can select 0 or many.
      d. Ask the user to declare a party, republicam, democrat or independent. User can skip and not select one.
      e. Display a review page with a submit.
      f. direct to an email confirmation code to be entered
      e. Direct to the accountability page

# Requirements

- For this implemention any valid email and a password will assume the correct account and route to the landing page
- if sign up is selected route to the sign up workflow
- Add a temporary option in the navigation drawer by the sign off to initiate the onboarding workflow
- For now let always launch the app with the accountability page displaying first.
