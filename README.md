# url-shortener
Creating a URL Shortener with NodeJs, Express, and MongoDB

URL shortener works by taking a long URL and applying a hashing algorithm to spit out a shorter version of the URL and stores them in a database for later lookup.

Once someone visits the short version of the URL, our server will query the database for that hash key to retrieve the original, longer URL and redirect them to it.

Technologies Used

Back end
Express- Nodejs framwork for building the REST Apis
Mongodb- Document oriented NoSQL database
Mongoose- MongoDB object modeling tool

Front end
Html - describing the structure and presentation of information.
CSS - Responsive front-end framework based on Material Design.
Javascript

Developing a Shortening Algorithm
1.Create a global auto incremented integer
2.Every time a new URL is shortened and added to our database, we'll increment that global number (base 10) and use it as our unique ID for that entry in the DB
3.Base58 encode that unique ID to generate a unique, shorter URL

Saving the shortened URLs
1.Taking long URL submitted by the user.
2.Storing the URL database. 
3.Encoding the _id of the newly inserted object.
4.Returning the shortened version of the URL to the user.

Check if the URL has already been shortened to avoid creating duplicates:
If it has been shortened, return the base58 encoded ID right away
If it hasn't been shortened, we will create a new entry for it

Redirecting the visitor

When someone visits a URL shortened by our service such as http://localhost:3000/3Yj, we want to:

1.Take the 3Yj from the URL
2.Decode it to get the unique _id of our document in the urls collection
3.Redirect them to the associated long_url in that document