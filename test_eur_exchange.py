from pyDolarVenezuela.pages import ExchangeMonitor
from pyDolarVenezuela import Monitor

try:
    monitor = Monitor(ExchangeMonitor, 'EUR')
    print(monitor.get_value_monitors())
except Exception as e:
    print(e)
