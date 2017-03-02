Deliverable 2 - Group 3:
Group Members: William Ieong, Shahrez Jan, Benjamin V Kincaid, Ibrahim Taher
* As a user, I want to make account 
   * User accesses the website, clicks on the sign up button. The user is presented with two options. 
      * 1) To sign up using email
      * 2) To sign up using various social media platforms (Facebook, Twitter, Google+)
   * For Option 1: The user will fill out a form with email, username, password, date of birth, security question, and then will accept terms and conditions. 
   * For Option 2: User will be prompted to authorize app in the social media platform (page will pop up asking to do so.) If user is not logged in to their social media account, they will be prompted to log into it. 
   * If email exists in database, user will be notified that the email already exists for an account.
   * A verification email will be sent to the users email. If option 2 is used, it will be sent to the email used to sign into the social media platform.
   * Database will store user information.
* As a user, I want to log into my account
   * User access webapp and enters homepage.
   * On homepage there will be a button clicked called “Sign In”
   * User will then be prompted to sign in using email and password or sign in using using social media platform (Facebook, Twitter, Google+).
   * User will then be notified if he/she logged in correctly.
   * If user forgot password or username, there will be a button for that.
* As a user, I have forgotten my password and want to make a new one (Secondary story)
   * User is prompted to enter their email to verify
   * We use that email and check against our database to see if they actually have a n account
   * If not, we inform that user that no such account exists
   * If it does, we then prompt the user to answer their security questions, which are retrieved from the database
   * If they successfully enter the answer, we generate a link to a temporary web page to reset their password
   * After the password is reset, we change the user info on our database
   * User is brought to the homepage where they can attempt to logon
* As a user, I have forgotten my username (Secondary story)
   * User is prompted to enter their email for verification
   * If email exists in database, then an email will be sent with username information. User will be notified via pop up
   * If email does not exist, the website will notify the user that the email does not exist for an account.
* As a user, I  want to add my playlists to the webapp
   * User must first login (see Login story)
   * User must authorize our webapp for appropriate online music platforms
   * If the user does not authorize the app, the app cannot proceed and nothings happens (or should we give a pop up to the user?)
   * User then selects playlist that he wish to add
   * Web server, using authentication for that platform, pulls user information
   * Playlist information is stored on the database
   * Playlist information is then either:
      * Displayed to the user 
      * Triggers some event to indicate to the user that the playlist was successfully added (pop-up, sound, flashing light)
* As a user, I want to translate playlist from one platform to another (i.e soundcloud to spotify)
   * User must first login (see Login story)
   * User must first add music (see Adding Playlist story)
   * User goes to my music page.
   * In music page, user will select translate playlist option. User will select playlist to translate and what platform they want to translate it to (i.e. Pandora to Spotify.)
   * Translation process will begin. 
   * If song does not exist on translated platform, it will not be added to the playlist.
   * After translation, user will see a tab in their playlists for that playlist for the other platform.
   * The user should also be able to see that playlist in the translated platform.
* As a user, I want to purchase a song 
   * User must first login (see Login story)
   * User must have playlist added (see Add Playlist user story)
   * If I User wants to purchase a song they should press down on the song until prompted to purchase from respective source if available on the connected platforms.
   * Then the user will be transferred to the respective platform to complete purchase.
* As a user, I want to seamlessly play an aggregate playlist from multiple platforms
   * User must be logged in (see Login story).
   * User should be able to see aggregated playlists from home screen.
   * User will be able to select the playlist which will open all songs currently in the playlist.
   * User will have the option to select an individual song or shuffle play from the playlist view.