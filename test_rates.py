from pyDolarVenezuela.pages import BCV, Monitor, CriptoDolar
from pyDolarVenezuela import Monitor as MonitorClass

def get_rates():
    try:
        monitor = MonitorClass(BCV(), 'USD')
        bcv_rate = monitor.get_value_monitors()
        print("BCV Rate:", bcv_rate)
    except Exception as e:
        print("Error fetching BCV:", e)

    try:
        monitor = MonitorClass(Monitor(), 'USD')
        parallel_rate = monitor.get_value_monitors()
        print("Parallel Rate:", parallel_rate)
    except Exception as e:
        print("Error fetching Parallel:", e)

    try:
        monitor = MonitorClass(CriptoDolar(), 'USD')
        crypto_rate = monitor.get_value_monitors()
        print("Crypto Rate:", crypto_rate)
    except Exception as e:
        print("Error fetching Crypto:", e)

if __name__ == "__main__":
    get_rates()
