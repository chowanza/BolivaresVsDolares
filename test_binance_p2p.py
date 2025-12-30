import requests
import json

def get_binance_p2p_rate():
    url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    data = {
        "fiat": "VES",
        "page": 1,
        "rows": 10,
        "tradeType": "BUY", # BUY means we are buying USDT with VES, so this is the ASK price (sellers selling to us)
        "asset": "USDT",
        "countries": [],
        "proMerchantAds": False,
        "shieldMerchantAds": False,
        "publisherType": None,
        "payTypes": []
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        
        if result.get("code") == "000000" and result.get("data"):
            ads = result["data"]
            print(f"Found {len(ads)} ads.")
            for ad in ads[:5]:
                advertiser = ad["advertiser"]["nickName"]
                price = ad["adv"]["price"]
                print(f"Advertiser: {advertiser}, Price: {price} VES/USDT")
        else:
            print("Failed to get data or no data found.")
            print(result)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_binance_p2p_rate()
