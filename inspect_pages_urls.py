from pyDolarVenezuela.pages import AlCambio, BCV, CriptoDolar, DolarToday, ExchangeMonitor, EnParaleloVzla, Italcambio
import inspect

def inspect_pages():
    classes = [AlCambio, BCV, CriptoDolar, DolarToday, ExchangeMonitor, EnParaleloVzla, Italcambio]
    print("Inspecting specific pages...")
    for obj in classes:
        print(f"Object: {obj}")
        if hasattr(obj, 'provider'):
            print(f"  Provider: {obj.provider}")
        if hasattr(obj, 'url'):
            print(f"  URL: {obj.url}")
        # Check for other attributes
        try:
            for attr_name, attr_value in vars(obj).items():
                if isinstance(attr_value, str) and attr_value.startswith('http'):
                    print(f"  {attr_name}: {attr_value}")
        except TypeError:
            pass

if __name__ == "__main__":
    inspect_pages()
