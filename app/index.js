// Ember['TEMPLATES'] = require('../tmp/templates')

var App = Ember.Application.create();

// Create a model
App.Photo = EPDB.Model.extend({
    // serialize method returns an object that's stored in the database
    serialize: function(){
        return this.getProperties(['name','description','image']);
    }
});

// Create an instance that you'll use to perform operations
App.pouch = EPDB.Storage.create({
    dbName: "your-app",
    docTypes: {
        photo: App.Photo
    }
});

App.Router.map(function(){
    this.route('photos');
    this.route('photo', {path:'photo/:id'});
});

App.PhotosRoute = Ember.Route.extend({
    model: function() {
        return App.pouch.findAll('photo');
    }
});

App.PhotoRoute = Ember.Route.extend({
    model: function(params) {
        return App.pouch.GET(params.id);
    }
});
