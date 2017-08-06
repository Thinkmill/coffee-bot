## 5/7/17

- Fixed bug where you would get no message when you closed a run
Fun fact! This was actually a different bug where people's slackId was not being saved when the user was created, so when closing runs it polled slack for nonexistant people and then instead of handling the error, it just didn't display the message. Fixed the passing of slackIds. Did not fix error handling. (YOLO)
- Built a 'forNode.js' file that accepts a single string as a message to pass to the plugins, allowing you to do testing offline.
