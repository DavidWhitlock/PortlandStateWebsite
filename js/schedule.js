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
    reviewInformation(div, hasDatePassed(new Date(startDate)), schedule.review);
  }
  
  
  // Don't show dates 30 days after the course has ended
  var showDate = now < endDate + (30 * 24 * 60 * 60 * 1000);

  for (var i = 0; i < schedule.meetings.length; i++) {
    var meeting = Date.parseString(schedule.meetings[i]);
    var hasPassed = hasDatePassed(meeting);
    var lecture = schedule.lectures[i];

    var heading = " Week " + (i + 1) + (showDate ? ": " + meeting.format("MMM d, yyyy") : "");
    var dl = lectureHeading(div, hasPassed, heading, lecture.screencasts, schedule.youTubeClassRecordingsListId);

    if (lecture.comment) {
      lectureComment(dl, hasPassed, lecture.comment)
    }

    if (lecture.topics) {
      lectureTopics(dl, hasPassed, lecture.topics, lecture.tdd);

    } else if (lecture.content) {
      lectureContent(dl, hasPassed, lecture.content, lecture.tdd);
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
function lectureHeading(parent, hasPassed, heading, screencasts, youTubeListId) {
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

  var span = $(document.createElement("span"));
  span.innerHTML = screencastsLinks(screencasts, youTubeListId);
  dt.appendChild(span);

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
function lectureContent(parent, hasPassed, content, tdd) {
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

  if (tdd) {
    var li = $(document.createElement("li"));
    ul.appendChild(li);
    li.innerHTML = testDrivenDevelopmentHtml(tdd);
    
  }
}

/**
 * Outputs HTML for the topics of a lecture
 */
function lectureTopics(parent, hasPassed, topics, tdd) {
  var ul = $(document.createElement("ul"));
  if (hasPassed) {
    ul.hide();
  }
  parent.appendChild(ul);

  if (topics.due) {
    if (topics.due instanceof Array) {
      for (var j = 0; j < topics.due.length; j++) {
        var project = topics.due[j];
        li(ul, project + " Due");
      }

    } else {
      li(ul, topics.due + " Due");
    }
  }

  if (topics.slides) {
    li(ul, "Before class, review the following materials:");

    var slidesUl = $(document.createElement("ul"));
    ul.appendChild(slidesUl);

    for (var j = 0; j < topics.slides.length; j++) {
      var slide = topics.slides[j];
      slideHtml(slidesUl, slide.title, slide.pdf, slide.screencasts);
    }
  }

  if (topics.handouts) {
    li(ul, "In class, we'll discuss the following handouts:");

    var handoutsUl = $(document.createElement("ul"));
    ul.appendChild(handoutsUl);
    for (var j = 0; j < topics.handouts.length; j++) {
      var handout = topics.handouts[j];
      pdf(handoutsUl, handout.title, handout.pdf);
    }
  }

  if (topics.projects) {
    for (var j = 0; j < topics.projects.length; j++) {
      var project = topics.projects[j];
      pdf(ul, project.title, project.pdf, "Assign ");
    }
  }

  if (topics.references) {
    li(ul, "References to reinforce what we've learned:");

    var referencesUl = $(document.createElement("ul"));
    ul.appendChild(referencesUl);
    for (var j = 0; j < topics.references.length; j++) {
      var reference = topics.references[j];
      url(referencesUl, reference.title, reference.url);
    }
  }

  if (tdd) {
    li(ul, testDrivenDevelopmentHtml(tdd));
  }
}

function screencastsLinks(screencasts, youTubeListId) {
  var description = "";
  if (screencasts instanceof Array) {
    if (screencasts.length > 0) {
      description += " (screencast ";

      for (var j = 0; j < screencasts.length; j++) {
        var youTubeId = screencasts[j];
        description += screencastLink(youTubeId, youTubeListId, "Part " + (j + 1));
         if (j < screencasts.length - 1) {
          description += ", ";
         }
      }

      description += ")";
    }

  } else if (screencasts) {
    description += " (" + screencastLink(screencasts, youTubeListId, "screencast") + "</a>)";
  }

  return description;
}

function slideHtml(ul, title, pdf, screencasts) {
  var description = "<a href='pdf/" + pdf +".pdf' target='_blank'>" + title + "</a>";

  var youTubeLecturesListId = "SPyM7S4CZk9WPrtC8AclCNxOBA8buEJdib";
  description += screencastsLinks(screencasts, youTubeLecturesListId);

  li(ul, description);
}

function screencastLink(youTubeId, youTubeListId, description) {
  return "<a href='https://www.youtube.com/watch?v=" + 
    youTubeId + "&list=" + youTubeListId + "' target='_blank'>" +
    description + "</a>";
}

function pdf(ul, title, pdf, prefix) {
  url(ul, title, "pdf/" + pdf +".pdf", prefix);
}

function url(ul, title, url, prefix) {
  if (prefix == null) {
    prefix = "";
  }

  li(ul, prefix + "<a href='" + url +"' target='_blank'>" + title + "</a>");
}

function li(ul, description) {
  var li = $(document.createElement("li"));
  ul.appendChild(li);
  li.innerHTML = description;
}

function testDrivenDevelopmentHtml(tdd) {
  var html = "After class, watch James Shore's <a href='http://jamesshore.com/Agile-Book/test_driven_development.html' target='_blank'>Test Driven Development</a> Screencast Episodes "

  for (var j = 0; j < tdd.length; j++) {
    var episode = tdd[j];

    html += "<a href='http://jamesshore.com/Blog/Lets-Play/";
    html += tddEpisodeName(episode);
    html += ".html' target='_blank'>";
    html += episode;
    html += "</a>";

    if (j < tdd.length -1 ) {
      html += ", ";
    }
  }

  return html;
}

function tddEpisodeName(episode) {
  if (episode == 1) {
    return "Lets-Play-Test-Driven-Development";
  
  } else {
    return "Episode-" + episode;
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
