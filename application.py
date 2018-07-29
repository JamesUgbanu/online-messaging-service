import os
from flask import Flask, render_template, request, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit
import string
import random

app = Flask(__name__)
channels = {}

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/channel", methods=["POST"])
def channel():
    # Query for channel input
    channelname = request.form.get("channel")

    random = id_generator()
    if len(channels) == 0:
        item = {
            "channel_id": random,
            "channel":
                {"name": channelname}

        }
        channels.update(item)
        return jsonify(item)
    else:
        for key, value in channels["channel"].items():

            if value == channelname:

                return jsonify({"error": "Display name already exist"})
            else:
                item = {
                    "channel_id": random,
                    "channel":
                        {"name": channelname}

                }
                channels.update(item)
                return jsonify(item)




if __name__ == "__main__":
    app.run()
