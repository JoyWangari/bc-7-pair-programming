var rootRef = new Firebase('https://pairprogram.firebaseio.com/');
username = $('#username').text();
session_id = $('#session_id').text();
sessionsRef = 'https://pairprogram.firebaseio.com/'

$(document).ready(function() {
    url_ = '';
    setTimeout(function() {
        url_ = window.location.pathname + window.location.hash;
        console.log(session_id)
        // send session details to server
        $.ajax({
            type: 'POST',
            url: '/sessions',
            data: JSON.stringify({
                id_: session_id,
                username: username,
                session_url: ('http://pprogram.herokuapp.com' + url_),
            }, null, '\t'),
            contentType: 'application/json;charset=UTF-8',
            success: function(result) {
                console.log(result);
            }
        });

    }, 3000);

    var usersAddr = 'https://pairprogram.firebaseio.com/users';
    var onlineUsers = []
    var allUsers = []
    var showOnlineUsers = function(users, exists) {
        if (exists) {
            for (user in users) {
                allUsers.push(users[user]['user_id'])
            }
        }

        if (allUsers) {
            $.each(allUsers, function(a, b) {
                if ($.inArray(b, onlineUsers) === -1) onlineUsers.push(b)
            })
        }

    }
    setTimeout(function() {
        for (username in onlineUsers) {
            $('#online-users').html(username)

        }
    }, 3000)
    window['onlineUsers'] = onlineUsers

    $('.invite-btn').on('click', function(g) {

        g.preventDefault();
        var key = $(this).parent().parent().find("td:first-child").text();
        console.log(key)

        url_ = window.location.pathname + window.location.hash;

        // send invite details to server
        $.ajax({
            type: 'POST',
            url: '/invite',
            data: JSON.stringify({
                id_: session_id,
                username_: username,
                session_link: 'http://pprogram.herokuapp.com' + window.location.pathname + window.location.hash,
            }, null, '\t'),
            contentType: 'application/json;charset=UTF-8',
            success: function(result) {
                console.log(result);
            }
        });
    });

    // Check for online users

    var pollUsers = function() {
        rootRef.child('users').once('value', function(snapshot) {
            var exists = (snapshot.val() !== null);
            showOnlineUsers(snapshot.val(), exists);
        });
    }

    pollUsers()
});

function init() {
  //// Initialize Firebase.
  var firepadRef = getExampleRef();
  // TODO: Replace above line with:
  // var firepadRef = new Firebase('<YOUR FIREBASE URL>');
  //// Create ACE
  var editor = ace.edit("firepad");
  editor.setTheme("ace/theme/textmate");
  var session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  session.setMode("ace/mode/javascript");
  //// Create Firepad.
  var firepad = Firepad.fromACE(firepadRef, editor, {
    defaultText: ' '
  });
}

// Helper to get hash from end of URL or generate a random one.
function getExampleRef() {
  var ref = new Firebase('https://pairprogram.firebaseio.com/');
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    window.location = window.location + '#' + ref.key(); // add it as a hash to the URL.
  }
  // if (typeof console !== 'undefined')
  //   console.log('Firebase data: ', ref.toString());
  setTimeout(function() {
    saveUserSession();
    console.log('Saving session');
    }, 5000);
  return ref;
}
window.onload = init;

var saveUserSession = function() {
    sessionInfo = {
        username: $('#username').text(),
        session: window.location.hash.replace(/#/g, '')
    }

    var rootRef = new Firebase('https://pairprogram.firebaseio.com/');
    childRef = $('#username').text();
    var sessionsRef = rootRef.child(childRef);
    pushOnline(sessionInfo, sessionsRef);
}

var pushOnline = function(object, ref) {
    var newRef = ref.push();
    newRef.set(object);
}

if (window.location.pathname.indexOf('session') != -1) {
    window.onload = configEditor;
}
