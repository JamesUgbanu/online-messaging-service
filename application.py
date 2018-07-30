import os
from flask import Flask, render_template, request, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit
import string
import random

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


channels = {}

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

@app.route("/")
def index():
    if "channel" in channels:
        data = channels["channel"]
    else:
        data = channels

    return render_template("index.html", channels=data)


@app.route("/channel", methods=["POST"])
def channel():
    # Query for channel input
    channelname = request.form.get("channel")
    random = id_generator()

    if len(channels) == 0:
        item = {
            "channel": [{"channel_id": random, "name": channelname}]
             }
        channels.update(item)
        return jsonify(channels)
    else:
        for value in channels["channel"]:
            if value["name"] == channelname:
                print(channelname)
                return jsonify({"error": "Display name already exist"})
            else:
                item = {"channel_id": random, "name": channelname}
                print(channelname)
                channels["channel"].append(item)
            return jsonify(channels)


@socketio.on("channel added")
def broadcast(data):
        emit("display channel", data, broadcast=True)


if __name__ == "__main__":
    app.run()
