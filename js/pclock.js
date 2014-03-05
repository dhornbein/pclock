// @todo add color to event data
// @todo build out display elements

// lets create a namespace
var pClock = {};

// a little closure, for you know, closure
(function(){

		// lets just keep some options here.
	  pClock.options = {
	  	renderer: {
	  		defaultColor: "#ff0000",
	  		strokeWidth: 10,
		  	w: 500,
		  	h: 500,
		  	r: 10,
		  	center: {
		  		x: 250,
		  		y: 250
		  	}
		  }
	  }

	  // this is for making ids out of plant names, but can come in useful later.
	  pClock.slugifyString = function(str){
	    str = str.toLowerCase();
	    str = str.replace(/[^a-z0-9]+/g, '-');
	    str = str.replace(/^-|-$/g, '');
	    return str;
		}

		// PClock Class
	  pClock.PClock = function( display, data ){
	  	this.data;
	  	this.renderer;
	  	this.display;
	  	this.species = {};
	  	this.setData( data );
	  	this.renderer = new pClock.Renderer( display, pClock.options.renderer );
	  	// console.log( 'PClock:', data );
	  	// console.log( 'Renderer:', this.renderer );
	  	this.buildSpecies();
	  }

	  pClock.PClock.prototype.setData = function(data){
	  	this.data = data;
	  }

	  // Its a verifiable factory
	  // http://www.joezimjs.com/javascript/javascript-design-patterns-factory/
	  pClock.PClock.prototype.buildSpecies = function(){
			for ( var i=0; i < this.data.length; i++) {
				sp = new pClock.Species( this.data[i], this, this.renderer );
				this.species[ pClock.slugifyString( this.data[i].name ) ] = sp;
				this.renderer.renderSpecies( sp, i );
			}
	  }

	  // Renderer takes care of displaying things
	  pClock.Renderer = function( el, options ) {
	  	this.element = el;
	  	this.options = options;
      this.paper = Raphael( this.element, this.options.w, this.options.h );
      console.log( this.paper );
      this.defineCustomAttributes();
	  }

		pClock.Renderer.prototype.constructor = pClock.Renderer;

		// some extending of the Rafael instance
	  pClock.Renderer.prototype.defineCustomAttributes = function(){
	  	var self = this;
      var ca = this.paper.customAttributes.arc = function (x, y, radius, startDate, endDate) {
        return {
        	path: self.describeArc(x, y, radius, self.dateToDegree(startDate), self.dateToDegree(endDate))
        };
      };
      return ca;
	  }

	  pClock.Renderer.prototype.renderSpecies = function( sp, speciesIndex ){
	  	var self = this;
	  	var events = sp.getEvents();
	  	var r = pClock.options.renderer.r;

	  	$( events ).each( function( index ){
	  		// console.log( this, index, r );
				var eventElement = self.paper.path().attr({
					"stroke": pClock.options.renderer.defaultColor,
					"stroke-width": pClock.options.renderer.strokeWidth
				}).attr({
					arc: [
						pClock.options.renderer.center.x,
						pClock.options.renderer.center.y,
						r * speciesIndex,
						events[index].start,
						events[index].end
					]
				});
				self.assignSpeciesEventEventHandlers( sp.getData(), eventElement );
	  	});
	  }

	  pClock.Renderer.prototype.assignSpeciesEventEventHandlers = function( data, eventElement) {
	  	this.assignSpeciesEventMouseOver( data, eventElement );
	  	this.assignSpeciesEventClick( data, eventElement );
	  }
	  
	  pClock.Renderer.prototype.assignSpeciesEventMouseOver = function( data, eventElement ) {
	  	eventElement.mouseover( function( e ){
	  		console.log( "mouseover", data.name );
	  	});
	  }

	  pClock.Renderer.prototype.assignSpeciesEventClick = function( data, eventElement ) {
	  	eventElement.mouseover( function( e ){
	  		console.log( "clicked", data.name );
	  	});
	  }

	  pClock.Renderer.prototype.describeArc = function( x, y, radius, startAngle, endAngle ){
	  	var start, end, arcSweep, d;
			start = this.polarToCartesian(x, y, radius, endAngle);
			end = this.polarToCartesian(x, y, radius, startAngle);
			arcSweep = ( endAngle - startAngle <= 180 ) ? "0" : "1";
			d = [
				["M", start.x, start.y],
				["A", radius, radius, 0, arcSweep, 0, end.x, end.y]
			];
			return d;
	  }

	  pClock.Renderer.prototype.dateToDegree = function( date ) {
      var date = new Date(date);
      var dayOfYear = date.getDOY();
      var ratio = dayOfYear / 365; // do we really need to worry about leap years? - yes!
      return ratio * 360;
	  }

	  pClock.Renderer.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
	    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
	    return {
		    x: centerX + (radius * Math.cos(angleInRadians)),
		    y: centerY + (radius * Math.sin(angleInRadians))
			}
		}

		pClock.PClock.prototype.contructor = pClock.PClock;

	  pClock.Species = function ( data, marshal ) {
	  	this.marshal = marshal;
	  	this.data = data;
	  	this.id = data.id;
	  	this.categories = data.categories;
	  	this.name = data.name;
	  	this.commonName = data.commonName;
	  	this.description = data.description;
	  	this.color = data.color;
	  	this.events = data.events;
//	  	console.log( this.name, "reporting for duty! my events are", this.events );
	  }

	  pClock.Species.prototype.getData = function(){
	  	return {
	  		name: this.name,
	  		commonName: this.commonName,
	  		description: this.description,
	  		color: this.color
	  	}
	  }

	  pClock.Species.prototype.getEvents = function(){
	  	return this.events;
	  }


	  // Instantiate things once the dom is ready
		document.addEventListener("DOMContentLoaded", function(event) {

		Date.prototype.getDOY = function() {
			var onejan = new Date( this.getFullYear(),0,1);
			return Math.ceil((this - onejan) / 86400000);
		}

		// This gets things started 
		pClock.initApp = function(){
			if( pClock.data ) {
				clearInterval( pClock.dataLoadInterval );
				phenClock = new pClock.PClock( document.getElementById('pClock'), pClock.data );
			}
		}

		// start the app up only if the data's already loaded
		if( pClock.data ) {
			pClock.initApp();
		}else {
			pClock.dataLoadInterval = setInterval( pClock.initApp, 1000 );
		}

  });



})();

// this parses the data that came in from google docs
function phenClockGDImport (json ) {
	var out = [];
	for(i = 0; i < json.feed.entry.length; i++){
		entry = json.feed.entry[i];

		out[i] = {
			'id': entry.gsx$id.$t,
			'categories': entry.gsx$category.$t.split(','),
			'category': entry.gsx$category.$t,
			'name': entry.gsx$name.$t,
			'events': [{
			    'start': entry.gsx$eventstart.$t,
			    'end': entry.gsx$eventend.$t
			}],
			'description': entry.gsx$description.$t,
			'color': entry.gsx$color.$t.replace('#','')
		}
	}
	pClock.data = out;
}
