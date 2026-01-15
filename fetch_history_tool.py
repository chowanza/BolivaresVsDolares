import csv
import time
from datetime import datetime, timedelta
from pyDolarVenezuela.pages import BCV, EnParaleloVzla
from pyDolarVenezuela import Monitor

def fetch_and_save_history():
    # Setup
    monitors_config = [
        # (Provider, Key, Label)
        (BCV, 'usd', 'BCV'), 
        (EnParaleloVzla, 'enparalelovzla', 'Paralelo')
    ]
    
    start_date = "01-01-2024" # DD-MM-YYYY
    end_date = datetime.now().strftime("%d-%m-%Y")
    
    results = []

    print(f"--- Fetching History ({start_date} to {end_date}) ---")

    for provider, key, label in monitors_config:
        print(f"\nQuerying {label}...")
        try:
            # Note: pyDolarVenezuela relies on the provider website having history accessible.
            # Some providers might fail or timeout.
            monitor = Monitor(provider, 'USD')
            
            # The library says it supports history. Let's try to fetch it.
            # If this fails, it means the library requires a local DB populated over time.
            history = monitor.get_prices_history(key, start_date, end_date)
            
            if history:
                print(f"Success! Found {len(history)} records for {label}.")
                for record in history:
                    # Adjust attributes based on actual object structure (usually record.date, record.price)
                    # Inspecting object structure might be needed if it fails.
                    date_val = record.date if hasattr(record, 'date') else getattr(record, 'created_at', 'N/A')
                    price_val = record.price if hasattr(record, 'price') else 0
                    results.append({
                        'date': date_val,
                        'source': label,
                        'rate': price_val
                    })
            else:
                print(f"No records found for {label}.")
                
        except Exception as e:
            print(f"Error fetching {label}: {e}")
            print("Tip: The website might be blocking the request or the library requires a local DB.")

    # Save to CSV
    if results:
        fieldnames = ['date', 'source', 'rate']
        filename = 'historical_rates.csv'
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
        print(f"\nSaved {len(results)} records to {filename}")
    else:
        print("\nNo data collected to save.")

if __name__ == "__main__":
    fetch_and_save_history()
