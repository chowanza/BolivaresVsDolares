try:
    from pyDolarVenezuela import Provider
    import inspect
    print(inspect.getsource(Provider))
except ImportError:
    print("Provider not in pyDolarVenezuela")
    try:
        from pyDolarVenezuela.provider import Provider
        import inspect
        print(inspect.getsource(Provider))
    except ImportError:
        print("Provider not in pyDolarVenezuela.provider")
