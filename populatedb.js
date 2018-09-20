// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Messages = require('./models/message');



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

function messageCreate(from_uid, to_uid, msg_content, msg_status,msg_type, createdAt, last_updated) {
  messagedetail = {
    from_uid: from_uid,
    to_uid: to_uid,
    msg_content: msg_content,
    msg_status: msg_status,
    msg_type : msg_type,
    createdAt: createdAt,
    last_updated: last_updated
  }

  var message = new Messages(messagedetail);
  message.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New message: ' + message);
  });
}

function messageCreateCall(cb) {
    async.parallel([
        function(callback) {
          messageCreate('5aa050f1fec5b61510bb52b0', '5a9e901b0cbe690b92bac4fa', 'Hello', '1','1','1520341019302','1520341019302',callback);
        },
        function(callback) {
          messageCreate('5a9e901b0cbe690b92bac4fa', '5aa050f1fec5b61510bb52b0', 'HI','1','1','1520341019302','1520341019302',callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
     messageCreateCall
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
