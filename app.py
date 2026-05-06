from flask import Flask, render_template,request, jsonify
import os
import subprocess #biblioteca usada para meu codigo comunicar com terminal (cmd,bash)
import platform #biblioteca usada para obter informações do sistema operacional

app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/') #end-point
def index():
    return render_template('index.html')



@app.route("/ping", methods=["POST"]) #end-point para meu js - tudo que e uma rota e um end-point
def ping_ip():
    data = request.get_json()
    ip = data.get("ip")

    # se for windows usa -n se for linux/mac usa -c
    param = "-n" if platform.system().lower() == "windows" else "-c"

    try:
        result = subprocess.run(
            ["ping", param, "4", ip],  #aqui onde ele executa o comando ping param(-n / -c) "1", ip (valor do nosso js)
            capture_output=True,
            text=True,
            encoding= "cp850"
        )
        if result.returncode == 0:
            return jsonify({
                "status": "ok",
                "output": result.stdout
            })
        else:
            return jsonify({
                "status": "offline",
                "output": result.stderr
            })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })
    

@app.route("/tracert", methods=["POST"])
def tracert_ip():
    data = request.get_json() or {}
    ip = data.get("ip")

    if not ip:
        return jsonify({
            "status": "error",
            "message": "IP inválido"
        })

    try:
        if platform.system().lower() == "windows":
            command = ["tracert", ip]
        else:
            command = ["traceroute", ip]

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding= "cp850"
        )

        if result.returncode == 0:
            return jsonify({
                "status": "ok",
                "output": result.stdout
            })
        else:
            return jsonify({
                "status": "offline",
                "output": result.stderr
            })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
