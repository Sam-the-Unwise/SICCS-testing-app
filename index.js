const github = require('@octokit/rest')

// use context.payload to see all the information



// GraphQL query to add a comment
const addComment = `
  mutation comment($id: ID!, $body: String!) {
    addComment(input: {subjectId: $id, body: $body}) {
      clientMutationId
    }
  }
`



module.exports = app => {

  var comment = ''

  app.on('issue_comment.created', context => {

    // log the contents of the comment
    //context.log(context.payload);

    //siccs-testing-app[bot]

    // get username of commenter
    //context.log(context.payload.comment.user.login)

    if(context.payload.comment.user.login != ("siccs-testing-app[bot]"))
    {
      
      if(context.payload.comment.body.includes("@siccs-testing-app"))
      {
        if(context.payload.comment.body.includes("Hello"))
        {
          comment += "Hello"
        }

        if(context.payload.comment.body.includes("?"))
        {
          comment += ' I see that you are asking a question'
        }
        
        context.github.query(addComment, {
            id: context.payload.issue.node_id,
            body: comment
        });
      }
    }
  });
    

    // will log the contents of the comment
    //context.log(context.payload.comment.body);

  app.on('pull-request.opened', context => {
    context.log("OPENED");
  })
}


// PULL REQUESTS


// //////////////////////// REOPEN, EDIT \\\\\\\\\\\\\\\\\\\\\\\\\

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


// simple create date function
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



