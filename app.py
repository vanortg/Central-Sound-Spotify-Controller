from flask import Flask, render_template, redirect, request
import startup, requests
app = Flask(__name__)

@app.route('/')
def index():
    response = startup.getUser()
    return redirect(response)

@app.route('/callback/')
def callback():
    startup.getUserToken(request.args['code'])
    return redirect('/home')

@app.route('/home')
def home():
    return render_template('player.html')

@app.route('/post/')
def postReturn():
    print(request.args)
