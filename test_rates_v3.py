from pyDolarVenezuela.pages import BCV, EnParaleloVzla, ExchangeMonitor, CriptoDolar
from pyDolarVenezuela import Monitor

def get_rates():
    print("Fetching BCV...")
    try:
        monitor = Monitor(BCV, 'USD')
        print("BCV Rate:", monitor.get_all_monitors())
    except Exception as e:
        print("Error fetching BCV:", e)

    print("Fetching EnParaleloVzla...")
    try:
        monitor = Monitor(EnParaleloVzla, 'USD')
        print("EnParaleloVzla Rate:", monitor.get_all_monitors())
    except Exception as e:
        print("Error fetching EnParaleloVzla:", e)

    print("Fetching ExchangeMonitor...")
    try:
        monitor = Monitor(ExchangeMonitor, 'USD')
        print("ExchangeMonitor Rate:", monitor.get_all_monitors())
    except Exception as e:
        print("Error fetching ExchangeMonitor:", e)
        
    print("Fetching CriptoDolar...")
    try:
        monitor = Monitor(CriptoDolar, 'USD')
        print("CriptoDolar Rate:", monitor.get_all_monitors())
    except Exception as e:
        print("Error fetching CriptoDolar:", e)

if __name__ == "__main__":
    get_rates()
