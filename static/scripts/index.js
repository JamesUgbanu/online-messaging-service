
document.addEventListener('DOMContentLoaded', () => {

                    let pathname = window.location.pathname;

          let regex = /([A-Z])\w+/g;

          let test = pathname.match(regex);

                // Connect to websocket
    let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

                    document.querySelector('#plus').onclick = () => {
                        document.querySelector('#mybtn').disabled = true;
                 }


                          document.querySelector('#channel').onkeyup = () => {
                    if (document.querySelector('#channel').value.length > 3)
                        document.querySelector('#mybtn').disabled = false;
                    else
                        document.querySelector('#mybtn').disabled = true;
                    };



                       // When connected, configure button
        socket.on('connect', () => {

                   //  Add New post
                 document.querySelector('#send-message').onsubmit = function() {
                        // Initialize new request
                        const xhr = new XMLHttpRequest();
                       const message = document.querySelector('#message').value;
                       const id = document.querySelector('#channel-id').value;
                        const name = document.querySelector('#display-name').value = storageValue;

                         // Clear input field
                    document.querySelector('#message').value = '';

                        xhr.open('POST', '/message');
                        // Callback function for when request completes
                        xhr.onload = () => {

                            // Extract JSON data from request
                            const messages = JSON.parse(xhr.responseText);
                                socket.emit('message added', messages);

                            }

                         // Add data to send with request
                        const form = new FormData();
                       form.append('message', message);
                       form.append('channel-id', id);
                       form.append('display-name', name);
                        // Send request
                        xhr.send(form);
                        return false;
                    };
                  });



                //Add New channel
                 document.querySelector('#mybtn').onsubmit = function() {
                        // Initialize new request
                        const request = new XMLHttpRequest();
                       const channel = document.querySelector('#channel').value;

                         // Clear input field
                    document.querySelector('#channel').value = '';
                     document.querySelector('#mybtn').disabled = true;
                        request.open('POST', '/channel');

                        // Callback function for when request completes
                        request.onload = () => {

                            // Extract JSON data from request
                            const data = JSON.parse(request.responseText);
                            // Update the result div
                            let error = document.querySelector('.error');
                            if (data.error) {
                                error.innerHTML = `${data.error}`;
                            }
                            else {

                            const li = document.createElement('li');
                          li.className = "list-group-item";
                          const aTag = document.createElement('a');
                          aTag.setAttribute('href',`messages/${data.channel_id}`);
                          aTag.innerHTML = `${data.name}`;
                          li.appendChild(aTag);
                          document.querySelector('#channel-list').append(li);

                              //display success
                               // error.innerHTML = "Added Successfully";
                                   // refresh page
                                 window.location.reload();
                            }
                        }

                        // Add data to send with request
                        const data = new FormData();
                       data.append('channel', channel);

                        // Send request
                        request.send(data);
                        return false;
                    };


                     // When a new message is announced, add to the list of messages
         socket.on('display message', data => {

              //Show on a channel
                    if(data.channel_id == test[0]) {
                         // Update the result div
                    const msg = document.createElement('div');
                    msg.className = "msg";
                    const media = document.createElement('div');
                    media.className = "media-body";
                      const small = document.createElement('small');
                      small.ClassName = "pull-right time";
                      const i = document.createElement('i');
                       i.ClassName = "fa fa-clock-o";
                       small.appendChild(i);
                            i.innerText = `${data.time }`;
                      const h5 = document.createElement('h5');
                            h5.className = "media-heading";
                            h5.innerHTML = `${data.displayName}`;
                        const small2 = document.createElement('small');
                            small2.className = "col-sm-11";
                        small2.innerHTML = `${data.text}`;
                        const button = document.createElement('button');
                                button.className = "btn btn-danger pull-right";
                         const x = document.createElement('i');
                                x.className = "fa fa-close";
                                button.append(x);

                            msg.appendChild(media);
                            msg.appendChild(small);
                            msg.appendChild(h5);
                            msg.appendChild(small2);
                            msg.appendChild(button)
                          document.querySelector('#messages').append(msg);
                    }

                });

            });
//
// document.getElementById("MyElement").classList.add('MyClass');
//
// document.getElementById("MyElement").classList.remove('MyClass');
//
// if ( document.getElementById("MyElement").classList.contains('MyClass') )
//
// document.getElementById("MyElement").classList.toggle('MyClass');