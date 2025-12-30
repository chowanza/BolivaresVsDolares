from pyDolarVenezuela.pages import BCV
from pyDolarVenezuela import Monitor

try:
    monitor = Monitor(BCV, 'EUR')
    print("BCV EUR Rate:", monitor.get_value_monitors())
except Exception as e:
    print("Error fetching BCV EUR:", e)
