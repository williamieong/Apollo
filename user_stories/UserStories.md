Deliverable 2 - Group 3:
Group Members: William Ieong, Shahrez Jan, Benjamin V Kincaid, Ibrahim Taher

* As a user, I want to link my youtube and spotify account
   * User accesses the website and is presented with a series of options.
      * 1) The user must authenticate with spotify
      * 2) After authenticating with spotify they are then able to authenticate with youtube
   * A user must authenticate with youtube in order to create any playlist

 * As a user, I want to translate playlist from one platform to another (spotify to youtube)
   * User must first authenticate with youtube and spotify (see linking youtube and spotify story)
   * User then must retrieve their playlists from spotify by clicking the "Get User Playlists link"
   * User then must retrieve tracks from these playlists by clicking "Get Spotify Playlists Tracks", 
      this retrieves actual information about the playlists
   * User then clicks "Create User Playlist" which will automatically create all of their Spotify playlists on youtube

//no longer applicable (handled spotify/youtube end)
* As a user, I want to log into my account
   * User access webapp and enters homepage.
   * On homepage there will be a button clicked called “Sign In”
   * User will then be prompted to sign in using email and password or sign in using using social media platform (Facebook, Twitter, Google+).
   * User will then be notified if he/she logged in correctly.
   * If user forgot password or username, there will be a button for that.

//no longer applicable (handled spotify/youtube end)
* As a user, I have forgotten my password and want to make a new one (Secondary story)
   * User is prompted to enter their email to verify
   * We use that email and check against our database to see if they actually have a n account
   * If not, we inform that user that no such account exists
   * If it does, we then prompt the user to answer their security questions, which are retrieved from the database
   * If they successfully enter the answer, we generate a link to a temporary web page to reset their password
   * After the password is reset, we change the user info on our database
   * User is brought to the homepage where they can attempt to logon

//no longer applicable (handled on spotify end)
* As a user, I have forgotten my username (Secondary story)
   * User is prompted to enter their email for verification
   * If email exists in database, then an email will be sent with username information. User will be notified via pop up
   * If email does not exist, the website will notify the user that the email does not exist for an account.

//no longer applicable (functionality not yet implemented)
* As a user, I  want to add my playlists to the webapp
   * User must first login authenticate with spotify (see user story)
   * If the user does not authorize the app, the app cannot proceed and nothings happens (or should we give a pop up to the user?)
   * User then selects playlist that he wish to add
   * Web server, using authentication for that platform, pulls user information
   * Playlist information is stored on the database
   * Playlist information is then either:
      * Displayed to the user 
      * Triggers some event to indicate to the user that the playlist was successfully added (pop-up, sound, flashing light)


//No longer applicable (functionality not yet implemented)
* As a user, I want to purchase a song 
   * User must first login (see Login story)
   * User must have playlist added (see Add Playlist user story)
   * If I User wants to purchase a song they should press down on the song until prompted to purchase from respective source if available on the connected platforms.
   * Then the user will be transferred to the respective platform to complete purchase.

//no longer applicable (functionality not yet implemented)
* As a user, I want to seamlessly play an aggregate playlist from multiple platforms
   * User must be logged in (see Login story).
   * User should be able to see aggregated playlists from home screen.
   * User will be able to select the playlist which will open all songs currently in the playlist.
   * User will have the option to select an individual song or shuffle play from the playlist view.