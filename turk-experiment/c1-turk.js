// Simple study demonstrating the use of a tablet-designed webpage. 
// Study is designed using simple JS/HTML/CSS, with data saves to a server
// controlled by call to a short php script. 

// Overview: (i) Parameters (ii) Helper Functions (iii) Control Flow

// ---------------- PARAMETERS ------------------

var numtrials = 4;

var usesound = true;

var isloaded = true;

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

function updateText(value) {
	$("#sliderlabel").html(value + "%");
}

getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function preloadImage(url) {
    var img=new Image();
    img.src=url;
}

function addSourceToVideo(element, src, type) {    
    var source = document.createElement('source');    
    source.src = src;    
    source.type = type;    
    element.appendChild(source);    
}

progressHandler = function(e) {    
    if( video.duration ) {    
        var percent = (video.buffered.end(0)/video.duration) * 100;    
        console.log( percent );    
        if( percent >= 100 ) {    
            console.log("loaded!");    
            isloaded = true;
        }    
        video.currentTime++;    
    }    
}


// STIMULI AND TRIAL TYPES

var v1 = [["new","sprock","no"],["new","blicket","yes"],["","zorp","no"],["","boti","yes"]]

var v2 = [["new","toma","no"],["new","wug","yes"],["","blicket","no"],["","sprock","yes"]]

var v3 = [["new","blicket","no"],["new","sprock","yes"],["","toma","no"],["","wug","yes"]]

var v4 = [["new","wug","no"],["new","toma","yes"],["","gade","no"],["","koba","yes"]]

var versions = [[v1,"v1"],[v2,"v2"],[v3,"v3"],[v4,"v4"]]

var words = ["blicket", "wug", "toma", "gade", "sprock", "koba", "zorp", "boti"];

var wordsmap = {
	"sprock": "gade",
	"gade": "sprock",
	"blicket": "koba",
	"koba": "blicket",
	"zorp":"wug",
	"wug":"zorp",
	"boti":"toma",
	"toma":"boti"
}

var sides = [1,2,3,4]

/* 
side 1: target left, target name first
side 2: target left, target name second
side 3: target right, target name first
side 4: target right, target name second
*/

/* block 2 of stimuli
var v1b2 = [["new","gade","no"],["new","koba","yes"],["","wug","no"],["","toma","yes"]]
var v2b2 = [["new","boti","no"],["new","zorp","yes"],["","koba","no"],["","gade","yes"]]
var v3b2 = [["new","koba","no"],["new","gade","yes"],["","boti","no"],["","zorp","yes"]]
var v4b2 = [["new","zorp","no"],["new","boti","yes"],["","sprock","no"],["","blicket","yes"]]
*/


//-----------------------------------------------



$("#interactionvideo").attr("src", "videos/wugno.mp4")
var myvideo = document.getElementById("interactionvideo");
myvideo.muted = true
myvideo.pause()
myvideo.play()

var imagedict = {};
var image;
var imgurl = "";
var imgname = "";
for (i=0; i < words.length; i++) {
	imgurl = "images/" + words[i] + ".png";
	imgname = "" + words[i]
	image = preloadImage(imgurl);
	imagedict[imgname] = image;
	imgurl = "images/" + words[i] + "distractor.png";
	imgname = words[i] + "distractor"
	image = preloadImage(imgurl);
	imagedict[imgname] = image;
}

setTimeout(function () {showSlide("prestudy");}, 3000);

// MAIN EXPERIMENT
var experiment = {

	subid: "",

	subage: 0,

	version: "",

	counter: 1,

	trialtype: "",

	modifier: "",

	response: "",

	targetname: "",

	sides: [],

	chosetarget: false,

	chosenside: "",

	targetpos: 0,

	targetside: "",
		
	date: getCurrentDate(),
		//the date of the experiment
	timestamp: getCurrentTime(),
		//the time that the trial was completed at 

	trialtypes: [],

	rtchoice: 0,

	data: [],

	trialsounds: [],

	allstims: [],

	canclick: false,

	objects: [],

	sidesmatchorder: false,

	targetnamefirst: false,


	startexp: function() {

		document.body.style.background = "white";
		$("#pauseslide").hide();
		setTimeout(function () {
			experiment.start();
		}, 1000);

	},

	pauseslide: function() {

		versions = shuffle(versions)
		experiment.version = versions.pop()

		experiment.trialtypes = shuffle(experiment.version[0])

		var video;
		
    	video = document.getElementsByTagName('video')[0];    
    	for (j = 0; j < v1.length; j++) {
    		console.log("loading video " + j)
    		addSourceToVideo( video, "videos/" + v1[j][0] + v1[j][1] + v1[j][2] + ".mp4", "video/mp4");
    		addSourceToVideo( video, "videos/" + v2[j][0] + v2[j][1] + v2[j][2] + ".mp4", "video/mp4");
    		addSourceToVideo( video, "videos/" + v3[j][0] + v3[j][1] + v3[j][2] + ".mp4", "video/mp4");
    		addSourceToVideo( video, "videos/" + v4[j][0] + v4[j][1] + v4[j][2] + ".mp4", "video/mp4");

    	}

		if (usesound) {
			for (i=0; i < words.length; i++) {
				stimsound = new WebAudioAPISound("stimsounds/" + words[i] + wordsmap[words[i]]);
				experiment.trialsounds.push(stimsound);
				experiment.allstims.push("" + words[i] + wordsmap[words[i]]);
				stimsound = new WebAudioAPISound("stimsounds/find" + words[i]);
				experiment.trialsounds.push(stimsound);
				experiment.allstims.push("find" + words[i]);
				stimsound = new WebAudioAPISound("stimsounds/tap" + words[i]);
				experiment.trialsounds.push(stimsound);
				experiment.allstims.push("tap" + words[i]);
			}
		}

		experiment.sides = shuffle(sides)

		$("#prestudy").hide();
		$(startimg).attr("src", "images/orange-button.png");

		$( "#startimg" ).click(function() {
			setTimeout(function() {
				$("#pauseslide").fadeOut(1000);
				experiment.startexp();
			}, 1000);
		});

		showSlide("pauseslide");
		
	},

	// this function only used in ipad version
	checkInput: function() {
		//subject ID
  		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			return;
		}
  		experiment.subid = document.getElementById("subjectID").value;

		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject age</font>');
			return;
		}
		experiment.subage = parseInt(document.getElementById("age").value);
		experiment.pauseslide();
	},


	//the end of the experiment
    end: function () {
    	setTimeout(function () {
    		$("#selectionstage").fadeOut();
    	}, 100);
    	
    	// use line below for mmturkey version
    	// setTimeout(function() { turk.submit(experiment, true) }, 1500);
    	showSlide("finish");
    	document.body.style.background = "black";
    },

	//concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function() {
		
		var dataforRound = experiment.subid + "," + experiment.subage + "," + experiment.version[2]; 
		dataforRound += "," + experiment.counter + "," + experiment.trialtype[0] + "," + experiment.trialtype[1] + "," + experiment.trialtype[2] + "," + experiment.chosetarget + "," + experiment.targetname + "," + experiment.modifier;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.rtsearch;
		dataforRound += "," + experiment.targetpos + "," + experiment.targetside + "," + experiment.chosenside;
		dataforRound += "," + experiment.sidesmatchorder + "," + experiment.targetnamefirst;
		dataforRound += "\n";
		$.post("https://callab.uchicago.edu/experiments/foregrounding-backgrounding/datasave.php", {postresult_string : dataforRound});
		// use line below for mmturkey version
		//experiment.data.push(dataforRound);	
	},

	
	

	// MAIN DISPLAY FUNCTION
  	next: function(phase) {

  		// disables all scrolling functionality to fix a slide in place on the ipad
		document.ontouchmove = function(event){
   			 event.preventDefault();
		}

  		$("#selectionstage").hide();

  		if (experiment.counter > (numtrials)) {
            experiment.end()
			return;
		}

		
		if (phase == "video") {

			isloaded = false

			experiment.trialtype = experiment.trialtypes[experiment.counter - 1];
			$("#interactionvideo").attr("src", "videos/" + experiment.trialtype[0] + experiment.trialtype[1] + experiment.trialtype[2] + ".mp4")

			experiment.canclick = false;
  			experiment.targetname = "";
  			experiment.chosetarget = false;
  			experiment.targetpos = "";
  			experiment.modifier = "";
  			experiment.response = "";

			experiment.targetname = experiment.trialtype[1]


			if (experiment.trialtype[0] == "") {
				experiment.modifier = "nomodifier";
			} else {
				experiment.modifier = experiment.trialtype[0];
			}

			experiment.response = experiment.trialtype[2];

			var myvideo = document.getElementById("interactionvideo");
			//$("#interactionvideo").attr("src", "videos/" + experiment.trialtype[0] + experiment.trialtype[1] + experiment.trialtype[2] + ".mp4")
			
			
			$("#interactionvideo").hide()
			
			$("#videostage").fadeIn();
			$("#interactionvideo").show();
			myvideo.muted = false
			myvideo.pause()
			setTimeout(function() {myvideo.play()}, 1000)
			
			//setTimeout(function() {$("#interactionvideo").show(); $("#interactionvideo").load();$("#videostage").fadeIn();},3000)

			//$("#interactionvideo").autoplay = true

			
			myvideo.addEventListener('ended',myHandler,false);
			function myHandler(e) {
				setTimeout(function() {experiment.next("selection");$("#videostage").fadeOut(100);}, 2000)
			}
    		

			//setTimeout(function() {experiment.next("selection");$("#videostage").fadeOut(100);}, 9000)

			

		} else if (phase == "selection") {

			$("#selectionstage").hide()

			experiment.side = experiment.sides[experiment.counter - 1]
			
			if (experiment.side == 1 || experiment.side == 2) {
				experiment.targetside = "left"
				experiment.targetpos = 1
				$("#object1").attr("src", "images/" + experiment.trialtype[1] + ".png")
				$("#object2").attr("src", "images/" + experiment.trialtype[1] + "distractor.png")
				if (experiment.side == 1) {
					experiment.targetnamefirst = true;
					experiment.sidesmatchorder = true;
				} else {
					experiment.targetnamefirst = false;
					experiment.sidesmatchorder = false;
				}
			} else if (experiment.side == 3 || experiment.side == 4){
				experiment.targetside = "right"
				experiment.targetpos = 2
				$("#object1").attr("src", "images/" + experiment.trialtype[1] + "distractor.png")
				$("#object2").attr("src", "images/" + experiment.trialtype[1] + ".png")
				if (experiment.side == 3) {
					experiment.targetnamefirst = true;
					experiment.sidesmatchorder = false;
				} else {
					experiment.targetnamefirst = false;
					experiment.sidesmatchorder = true;
				}
			}
			$("#object1").hide()
			$("#object2").hide()

			$(object1).css({"border-color": "#FFFFFF", 
         			"border-width":"2px", 
         			"border-style":"solid"});
			$(object2).css({"border-color": "#FFFFFF", 
         			"border-width":"2px", 
         			"border-style":"solid"});


  			if (experiment.counter == 1) {
				//$( "#object1" ).on('touchstart',function() {
				$( "#object1" ).click(function() {
					if (experiment.canclick) {
						experiment.canclick = false;
						$(object1).css({"border-color": "#000000", 
	         			"border-width":"2px", 
	         			"border-style":"solid"});
	         			experiment.chosenside = "left";

	         			experiment.rtsearch = Date.now() - experiment.starttime;

	         			if (experiment.targetpos == 1) {
	         				experiment.chosetarget = true;
	         			} else {
	         				experiment.chosetarget = false;
	         			}
				
						experiment.processOneRow();

						experiment.counter++;
						
						setTimeout(function() {
							$("#selectionstage").fadeOut(1000);
							experiment.next("video");
						}, 1000);
					}
				});
				//$( "#object2" ).on('touchstart',function() {
				$( "#object2" ).click(function() {
					if (experiment.canclick) {
						experiment.canclick = false;
						$(object2).css({"border-color": "#000000", 
	         			"border-width":"2px", 
	         			"border-style":"solid"});
	         			experiment.chosenside = "right";

	         			experiment.rtsearch = Date.now() - experiment.starttime;

	         			if (experiment.targetpos == 2) {
	         				experiment.chosetarget = true;
	         			} else {
	         				experiment.chosetarget = false;	         				
	         			}

	         			experiment.processOneRow();
						
						experiment.counter++;
						
						setTimeout(function() {
							$("#selectionstage").fadeOut(1000);
							experiment.next("video");
						}, 1000);
					}
				});
				
			}

			setTimeout(function(){
				if (experiment.targetnamefirst) {
					trialsound = experiment.trialsounds[experiment.allstims.indexOf(experiment.targetname + wordsmap[experiment.targetname])]
				} else {
					trialsound = experiment.trialsounds[experiment.allstims.indexOf(wordsmap[experiment.targetname] + experiment.targetname)]
				}
				if (usesound) {trialsound.play();}
				experiment.starttime = Date.now();
			}, 2000);
					
			setTimeout(function(){
				$("#object1").show()
				$("#object2").show()
				$("#selectionstage").fadeIn(500)
			}, 2000);

			setTimeout(function(){
				trialsound = experiment.trialsounds[experiment.allstims.indexOf("find" + experiment.targetname)]
				if (usesound) {trialsound.play();}
			}, 5500);

		    setTimeout(function() {experiment.canclick = true;}, 3000)


		    setTimeout(function() {
		    	trialsound = experiment.trialsounds[experiment.allstims.indexOf("tap" + experiment.targetname)]
				if (usesound && experiment.canclick) {trialsound.play();}
		    }, 7500)
		} 
	},

	start: function() {

		// put column headers in data file
		var coltitles = "subid, subage, version, counter, mod, targetname, response, chosetarget, targetname,modifier, date, timestamp,rtsearch, targetpos,targetside,chosenside \n";
		$.post("https://callab.uchicago.edu/experiments/foregrounding-backgrounding/datasave.php", {postresult_string : coltitles});

		
	 	//for ipad version to prevent scrolling
	  	document.ontouchmove = function(event){
   			 event.preventDefault();
		}

		
		experiment.next("video");
	},

    
}
		