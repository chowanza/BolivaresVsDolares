from pyDolarVenezuela.pages import BCV, CriptoDolar, EnParaleloVzla, ExchangeMonitor

pages = [BCV, CriptoDolar, EnParaleloVzla, ExchangeMonitor]
for page in pages:
    print(f"{page.name} Currencies: {page.currencies}")



