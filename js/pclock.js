// lets create a namespace
var pClock = {};



(function(){

	  pClock.options = {
	  	render: {
		  	w: 500,
		  	h: 500,
		  	r: 10,
		  	center: {
		  		x: 250,
		  		y: 250
		  	}
		  }
	  }

	  pClock.slugifyString = function(str){
	    str = str.toLowerCase();
	    str = str.replace(/[^a-z0-9]+/g, '-');
	    str = str.replace(/^-|-$/g, '');
	    return str;
		}

		// PClock class
	  pClock.PClock = function( display, data ){
	  	this.data;
	  	this.renderer;
	  	this.display;
	  	this.species = {};
	  	this.setData( data );
	  	this.renderer = new pClock.Renderer( display, pClock.options.render );
	  	console.log( 'PClock:', data );
	  	console.log( 'Renderer:', this.renderer );
	  	this.buildSpecies();
	  }

	  pClock.PClock.prototype.setData = function(data){
	  	this.data = data;
	  }

	  pClock.PClock.prototype.buildSpecies = function(){
	  	console.log( this.data.length );
			for ( var s=0; s< this.data.length; s++) {
				sp = new pClock.Species( this.data[s], this, this.renderer );
				this.species[ pClock.slugifyString( this.data[s].name ) ] = sp;
				this.renderer.renderSpecies( sp.getEvents() );
			}
	  }

	  pClock.Renderer = function( el, options ) {
	  	this.element = el;
	  	this.options = options;
      this.paper = Raphael( this.element, this.options.w, this.options.h );
      this.defineCustomAttributes();
	  }

		pClock.Renderer.prototype.contructor = pClock.Renderer;

	  pClock.Renderer.prototype.defineCustomAttributes = function(){
      var ca = this.paper.customAttributes.arc = function (x, y, radius, startDate, endDate) {
        return {
        	path: describeArc(x, y, radius, dateToDegree(startDate), dateToDegree(endDate))
        };
      };
      return ca;
	  }

	  pClock.Renderer.prototype.renderSpecie = function( events ){
	  	events.each( function(){
				var anArc = this.paper.path().attr({stroke: color, "stroke-width": 10}).attr({arc: [centerX, centerY, R, start, end]});
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

	  pClock.Renderer.prototype.drawArc = function(){

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
	  	console.log( this.name, "reporting for duty! my events are", this.events );
	  }

	  pClock.Species.prototype.getEvents = function(){
	  	return {
	  		events: this.events
	  	}
	  }

	document.addEventListener("DOMContentLoaded", function(event) {

    console.log("DOM fully loaded and parsed");

		Date.prototype.getDOY = function() {
			var onejan = new Date( this.getFullYear(),0,1);
			return Math.ceil((this - onejan) / 86400000);
		}

    phenClock = new pClock.PClock( document.getElementById('pClock'), pClock.data );

  });


})();



function phenClockGDImport (json ) {
	console.dir( json );
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
