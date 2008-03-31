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
    return now > date.getTime();

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

  for (var i = 0; i < schedule.meetings.length; i++) {
    var meeting = Date.parseString(schedule.meetings[i]);
    var hasPassed = hasDatePassed(meeting);

    var dl = $(document.createElement("dl"));
    div.appendChild(dl);

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

    appendTextChild(dt, " Week " + (i+1) + ": " + meeting.format("MMM d, yyyy"));

    var lecture = schedule.lectures[i];
    if (lecture.comment) {
        var dd = $(document.createElement("dd"));
        if (hasPassed) {
          dd.hide();
        }
        dl.appendChild(dd);
        var ital = $(document.createElement("i"));
        dd.appendChild(ital);
        ital.innerHTML = lecture.comment;
    }

    if (lecture.content) {
      var ul = $(document.createElement("ul"));
      if (hasPassed) {
        ul.hide();
      }
      dl.appendChild(ul);

      for (var j = 0; j < lecture.content.length; j++) {
        var li = $(document.createElement("li"));
        ul.appendChild(li);
        li.innerHTML = lecture.content[j];
      }
    }
  }
}

/**
 * Appends a text node child to a given DOM node
 */
function appendTextChild(parent, text) {
  parent.appendChild(document.createTextNode(text));
}
