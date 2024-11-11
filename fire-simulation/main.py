from flask import Flask, request
import simulation_engine


app = Flask(__name__)

@app.route('/run_simulation', methods=['POST'])
def run():
    data = request.get_json()
    print(type(data))
    simulation_engine.run_simulation(data)
    return 'Simulation is running'


if __name__ == '__main__':
    app.run()