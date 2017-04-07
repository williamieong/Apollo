//Create MongoDB using JavaScript :O
Apollo = new Mongo().getDB('admin');
Apollo.createCollection("Users");
Apollo.createCollection("Search Queries")
