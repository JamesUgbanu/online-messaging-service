 // Set display name value of counter to null
            if (!localStorage.getItem('display_name'))
                localStorage.setItem('display_name', "null");

document.addEventListener('DOMContentLoaded', () => {
                //get display name from local storage
                let storageValue = localStorage.getItem('display_name');
                //show display name on profile
                document.querySelector('#name').innerHTML = storageValue;

                //Check if user has a display name
                    if(storageValue == "null") {
                        document.querySelector('#registration').style.display="block";
                    } else {
                        document.querySelector('#sidebar').style.display="block";
                    }
                // By default, submit button is disabled
                document.querySelector('#submit').disabled = true;

                // Enable button only if there is text in the input field
                document.querySelector('#display_name').onkeyup = () => {
                    if (document.querySelector('#display_name').value.length > 3)
                        document.querySelector('#submit').disabled = false;
                    else
                        document.querySelector('#submit').disabled = true;
                };

                document.querySelector('#submit').onclick = function() {
                    // Create new item for list
                    const displayName = document.querySelector('#display_name').value;

                         // Clear input field and disable button again
                    document.querySelector('#display_name').value = '';
                    document.querySelector('#submit').disabled = true;

                            // Save to local storage
                         localStorage.setItem('display_name', displayName)
                            // refresh page
                            window.location.reload();

                    // Stop form from submitting
                  return false;
                };


                    document.querySelector('#plus').onclick = () => {
                        document.querySelector('#mybtn').disabled = true;
                 }


                          document.querySelector('#channel').onkeyup = () => {
                    if (document.querySelector('#channel').value.length > 3)
                        document.querySelector('#mybtn').disabled = false;
                    else
                        document.querySelector('#mybtn').disabled = true;
                    };
                //Add New channel
                 document.querySelector('#mybtn').onclick = function() {
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
                                aTag.setAttribute('href',`${data.channel_id}`);
                                aTag.innerHTML = `${data.channel.name}`;
                                li.appendChild(aTag);
                              document.querySelector('#channel-list').append(li);
                              //display success
                                error.innerHTML = "Added Successfully";
                            }
                        }

                        // Add data to send with request
                        const data = new FormData();
                       data.append('channel', channel);

                        // Send request
                        request.send(data);
                        return false;
                    };

            });
//
// document.getElementById("MyElement").classList.add('MyClass');
//
// document.getElementById("MyElement").classList.remove('MyClass');
//
// if ( document.getElementById("MyElement").classList.contains('MyClass') )
//
// document.getElementById("MyElement").classList.toggle('MyClass');