/**
 * Initiates an AJAX call that populates the course schedule
 */
function loadSchedule(term) {
  new Ajax.Request('js/schedule-' + term + '.json',
  {
    method:'get',
    onSuccess: function(transport){
      if (transport.responseText) {
         // Convert the response into a JavaScript object
         var schedule;
         try {
           schedule  = transport.responseText.evalJSON(true);

         } catch (e) {
           alert(e);
           return;
         }

         populateSchedule(schedule);

      } else {
        alert("Could not load schedule data");
      }
    },
    onFailure: function() { 
      alert('Something went wrong...') 
    }
  });
}

var startDate;
var endDate;
var now = new Date().getTime();

/**
 * Returns whether or not the term is active and the given date
 * has passed.
 */
function hasDatePassed(date) {
  if (now > startDate && now < endDate) {
    return now > date.getTime() + (8 * 24 * 60 * 60 * 1000);

  } else {
    return false;
  }
}

/**
 * Generates HTML DOM based on the given schedule
 */
function populateSchedule(schedule) {
  var div = $('schedule');

  while (div.hasChildNodes()) {
    div.removeChild(div.firstChild);
  }

  startDate = Date.parseString(schedule.meetings.first()).getTime();
  endDate = Date.parseString(schedule.meetings.last()).getTime();

  // Add the information about the review of Java
  if (schedule.review) {
    reviewInformation(div, hasDatePassed(startDate), schedule.review);
  }
  
  
  // Don't show dates 30 days after the course has ended
  var showDate = now < endDate + (30 * 24 * 60 * 60 * 1000);

  for (var i = 0; i < schedule.meetings.length; i++) {
    var meeting = Date.parseString(schedule.meetings[i]);
    var hasPassed = hasDatePassed(meeting);

    var dl = lectureHeading(div, hasPassed, " Week " + (i+1) + (showDate ? ": " + meeting.format("MMM d, yyyy") : ""));

    var lecture = schedule.lectures[i];
    if (lecture.comment) {
      lectureComment(dl, hasPassed, lecture.comment)
    }

    if (lecture.content) {
      lectureContent(dl, hasPassed, lecture.content);
    }
  }
}

/**
 * Appends a text node child to a given DOM node
 */
function appendTextChild(parent, text) {
  parent.appendChild(document.createTextNode(text));
}

/**
 * Outputs HTML for the heading for a lecture
 */
function lectureHeading(parent, hasPassed, heading) {
  var dl = $(document.createElement("dl"));
  parent.appendChild(dl);

  var dt = $(document.createElement("dt"));
  dl.appendChild(dt);

  var img = $(document.createElement("img"));
  if (hasPassed) {
    img.src = "img/collapsed.gif";
  } else {
    img.src = "img/expanded.gif";
  }
  img.onclick = function() {
    var siblings = this.parentNode.siblings();
    if (siblings[0].visible()) {
      this.src = "img/collapsed.gif";

    } else {
      this.src = "img/expanded.gif";
    }

    siblings.invoke('toggle');
  };

  dt.appendChild(img);

  appendTextChild(dt, heading);

  return dl;
}

/**
 * Outputs HTML for a comment about a lecture
 */
function lectureComment(parent, hasPassed, comment) {
  var dd = $(document.createElement("dd"));
  if (hasPassed) {
    dd.hide();
  }
  parent.appendChild(dd);
  var ital = $(document.createElement("i"));
  dd.appendChild(ital);
  ital.innerHTML = comment;
}

/**
 * Outputs HTML for the content of a lecture
 */
function lectureContent(parent, hasPassed, content) {
  var ul = $(document.createElement("ul"));
  if (hasPassed) {
    ul.hide();
  }
  parent.appendChild(ul);

  for (var j = 0; j < content.length; j++) {
    var li = $(document.createElement("li"));
    ul.appendChild(li);
    li.innerHTML = content[j];
  }
}

/**
 * Outputs HTML about the review work that should be done before class starts
 */
function reviewInformation(parent, hasPassed, review) {
  var dl = lectureHeading(parent, hasPassed, " Before class starts: Brush up on your Java");

  lectureComment(dl, hasPassed, review.comment);
  lectureContent(dl, hasPassed, review.content);
}
