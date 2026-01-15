from pyDolarVenezuela.pages import BCV, EnParaleloVzla, ExchangeMonitor
from pyDolarVenezuela import Monitor
from datetime import datetime

def test_history():
    # 1. Test BCV
    print("--- Testing BCV History ---")
    try:
        monitor = Monitor(BCV, 'USD')
        # We need the specific monitor key. For BCV usually it's just 'bcv' or 'usd' depending on how it's structured.
        # Let's inspect available monitors first
        # But get_prices_history takes 'type_monitor'. 
        # For BCV page, usually the monitor is the page itself?
        # Let's try to get all monitors to see keys
        all_rates = monitor.get_all_monitors()
        pass 
        # It returns a list of MonitorModel or dict.
        
        # Let's try to guess key 'usd' for BCV or 'bcv'
        # The library documentation says type_monitor.
        
        # Taking a guess based on library common usage:
        # For BCV, the key is usually 'usd' (official).
        
        start_date = '01-01-2024'
        end_date = '05-01-2024'
        
        # Try fetching history 
        # Note: If this features requires a DB, it might fail or return empty if we didn't provide one.
        # But maybe it scrapes a history page?
        
        history = monitor.get_prices_history('usd', start_date, end_date) # 'usd' is the code for USD currency but maybe the monitor key is different?
        print(f"BCV History (first 2): {history[:2] if history else 'No data'}")
        
    except Exception as e:
        print(f"Error fetching BCV history: {e}")

    # 2. Test EnParaleloVzla
    print("\n--- Testing EnParaleloVzla History ---")
    try:
        monitor = Monitor(EnParaleloVzla, 'USD')
        # Key for EnParaleloVzla is usually 'enparalelovzla'
        history = monitor.get_prices_history('enparalelovzla', '01-01-2024', '05-01-2024')
        print(f"EnParaleloVzla History (first 2): {history[:2] if history else 'No data'}")
    except Exception as e:
        print(f"Error fetching EnParaleloVzla history: {e}")

if __name__ == "__main__":
    test_history()
