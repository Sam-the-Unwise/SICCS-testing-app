var dateJS = require('./other');
const Sherlock = require('sherlockjs')
const onMention = require('probot-on-mention')

// appID = '7007aa533fd32f165b4709f4c62d8c3747dd7945'
// auth = 'fad7be26a2dd101be98601650872d81d505cef0d'
// clientID = '8e5bda9ac571f636a02e'
// userAgent = 'Sentient Toaster v1.2.0'



// ATTEMPTING TO PULL ALL PULL REQUESTS AND ISSUES \\

// module.exports = robot => {

//   robot.on('*', async context => {
//     console.log(context.github.issues.list())
//   })
  
// }

// module.exports = app => {
//   app.on('pull_request_review', async context => {
//     context.log(context.payload)
//   })
// }

module.exports = app => {
  app.on('issue_comment.opened', async context => {
     console.log(context.payload)
  })
}




/////////// ATTEMPTING TO GET A COMMENT \\\\\\\\\\\\

// module.exports = robot => {

//   const comment = context.github.issues.getComment({
//     owner,
//     repo,
//     comment_id
//   });

//   robot.log(comment);
// }




// GraphQL query to add a comment
const addComment = `
  mutation comment($id: ID!, $body: String!) {
    addComment(input: {subjectId: $id, body: $body}) {
      clientMutationId
    }
  }
`
 


//////////////////////// COMMENT RESPONSE \\\\\\\\\\\\\\\\\\\\\\

module.exports = robot => {

  robot.on('issue_comment.created', context => {
  
    context.github.query(addComment, {
      id: context.payload.issue.node_id,
      body: 'Comment created'
    });

    robot.log(context);
    
  })
}


////////////////// TESTING SHERLOCK \\\\\\\\\\\\\\\\\\\\\\

var sherlocked = Sherlock.parse('Homework 5 due next monday at 3pm');
 
// Basic properties
var title = sherlocked.eventTitle;    // 'Homework 5 due'
var startDate = sherlocked.startDate; // Date object pointing to next monday at 3pm
var endDate = sherlocked.endDate;     // null in this case, since no duration was given
var isAllDay = sherlocked.isAllDay;   // false, since a time is included with the event
 
// Example of an additional custom property added by Watson
var validated = sherlocked.validated; // true




//////////////////////// OPEN, CLOSE, EDIT \\\\\\\\\\\\\\\\\\\\

module.exports = robot => {

  robot.on('issues.edited', async context => {

    // Post a comment on the issue
    context.github.query(addComment, {
      id: context.payload.issue.node_id,
      body: 'This issue has been edited'
    })

    robot.log(context);
  }), 

  robot.on('issues.reopened', async context => {
    // Post a comment on the issue
    today = date()

    context.github.query(addComment, {
      id: context.payload.issue.node_id,
      body: 'Issue was reopened on ' + today
    })

    robot.log(context)
  })

}

function date()
{
  var today = new Date();
  var ending = "am";
  var hours = today.getHours();

  if(hours > 12)
  {
    ending = "pm";
    hours -= 12;
  }

  var time = hours + ":" + today.getMinutes() + ":" + today.getSeconds() + ending;
  
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy + " at " + time;

  return today;
}



