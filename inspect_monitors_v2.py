from pyDolarVenezuela.pages import CriptoDolar, ExchangeMonitor
from pyDolarVenezuela import Monitor

def inspect_monitors():
    print("--- Inspecting CriptoDolar ---")
    try:
        monitor = Monitor(CriptoDolar, 'USD')
        rates = monitor.get_all_monitors()
        print(f"Type of rates: {type(rates)}")
        if isinstance(rates, list):
            for rate in rates:
                # Try to print all attributes to find relevant info
                attrs = vars(rate) if hasattr(rate, '__dict__') else rate
                print(f"Rate Object: {attrs}")
        elif isinstance(rates, dict):
             for key, value in rates.items():
                print(f"Key: {key}, Value: {value}")
        else:
            print(rates)
            
    except Exception as e:
        print(f"Error inspecting CriptoDolar: {e}")

    print("\n--- Inspecting ExchangeMonitor ---")
    try:
        monitor = Monitor(ExchangeMonitor, 'USD')
        rates = monitor.get_all_monitors()
        print(f"Type of rates: {type(rates)}")
        if isinstance(rates, list):
            for rate in rates:
                attrs = vars(rate) if hasattr(rate, '__dict__') else rate
                print(f"Rate Object: {attrs}")
        elif isinstance(rates, dict):
             for key, value in rates.items():
                print(f"Key: {key}, Value: {value}")
        else:
            print(rates)
    except Exception as e:
        print(f"Error inspecting ExchangeMonitor: {e}")

if __name__ == "__main__":
    inspect_monitors()
