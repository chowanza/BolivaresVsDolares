from pyDolarVenezuela.pages import CriptoDolar
from pyDolarVenezuela import Monitor

def get_rates():
    print("Fetching CriptoDolar...")
    try:
        monitor = Monitor(CriptoDolar, 'USD')
        rates = monitor.get_all_monitors()
        for rate in rates:
            print(f"Title: {rate.title}, Price: {rate.price}")
    except Exception as e:
        print("Error fetching CriptoDolar:", e)

if __name__ == "__main__":
    get_rates()
